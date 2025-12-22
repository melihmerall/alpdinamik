"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppContext } from "@/lib/app-context";
import KvkkModal from './kvkk-modal';

const ContactSection = () => {
	const { siteSettings } = useAppContext();
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState('');
	const [kvkkModalOpen, setKvkkModalOpen] = useState(false);
	const [kvkkAccepted, setKvkkAccepted] = useState(false);
	const [kvkkText, setKvkkText] = useState('');
	const [selectedFile, setSelectedFile] = useState(null);
	const formRef = React.useRef(null);

	useEffect(() => {
		if (siteSettings?.kvkkText) {
			setKvkkText(siteSettings.kvkkText);
		}
	}, [siteSettings]);

	const handleFileChange = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			// Check if file is zip or pdf
			const fileName = file.name.toLowerCase();
			if (!fileName.endsWith('.zip') && !fileName.endsWith('.pdf')) {
				setError('Sadece ZIP veya PDF dosyası yükleyebilirsiniz.');
				return;
			}
			// Check file size (max 10MB)
			if (file.size > 10 * 1024 * 1024) {
				setError('Dosya boyutu 10MB\'dan büyük olamaz.');
				return;
			}
			setSelectedFile(file);
			setError('');
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (!kvkkAccepted) {
			setError('KVKK metnini okumanız ve onaylamanız gerekmektedir.');
			return;
		}

		setLoading(true);
		setError('');
		setSuccess(false);
		
		const formData = new FormData(e.currentTarget);
		
		// Upload file if exists
		let fileUrl = null;
		if (selectedFile) {
			try {
				const uploadFormData = new FormData();
				uploadFormData.append('file', selectedFile);
				uploadFormData.append('folder', 'contact-files');

				const uploadResponse = await fetch('/api/upload', {
					method: 'POST',
					body: uploadFormData,
				});

				if (uploadResponse.ok) {
					const uploadData = await uploadResponse.json();
					// Use absoluteUrl if available, otherwise construct from relative URL
					fileUrl = uploadData.absoluteUrl || uploadData.url;
				} else {
					throw new Error('Dosya yüklenemedi');
				}
			} catch (err) {
				console.error('File upload error:', err);
				setError('Dosya yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
				setLoading(false);
				return;
			}
		}

		const data = {
			fullName: formData.get('name'),
			email: formData.get('email'),
			phone: formData.get('phone'),
			message: formData.get('message'),
			source: 'CONTACT_FORM',
			meta: {
				kvkk: kvkkAccepted,
				fileName: selectedFile?.name,
				fileSize: selectedFile?.size,
				fileUrl: fileUrl,
			},
		};

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (response.ok && result.success) {
				setSuccess(true);
				setError(''); // Clear any previous errors
				// Reset form safely
				if (formRef.current) {
					formRef.current.reset();
				} else if (e.currentTarget) {
					e.currentTarget.reset();
				}
				setSelectedFile(null);
				setKvkkAccepted(false);
			} else {
				setSuccess(false); // Clear success message
				setError(result.error?.message || 'Bir hata oluştu');
			}
		} catch (err) {
			console.error('Error:', err);
			setSuccess(false); // Clear success message
			setError('Form gönderilirken bir hata oluştu');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div 
			id="iletisim" 
			className="contact__section"
			style={{
				position: 'relative',
				background: 'transparent',
				padding: '80px 0',
			}}
		>
			<div className="container" style={{ position: 'relative' }}>
				<div className="row">
					{/* İletişim Kartı - Sol Taraf */}
					<div className="col-lg-4 col-md-5 mb-30">
						<div className="contact__info-card" style={{
							background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
							padding: '2.5rem',
							borderRadius: '12px',
							border: '1px solid rgba(255, 193, 7, 0.3)',
							boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
							height: '100%',
							display: 'flex',
							flexDirection: 'column',
							transition: 'all 0.3s ease',
							position: 'relative',
							overflow: 'hidden'
						}}>
							<div style={{ marginBottom: '2rem' }}>
								<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
									<i className="flaticon-phone" style={{ 
										fontSize: '2rem', 
										color: '#FFC107',
										display: 'inline-block'
									}}></i>
									<h4 style={{ 
										color: '#ffffff', 
										margin: 0,
										fontSize: '1.5rem',
										fontWeight: '600'
									}}>
										İletişim
									</h4>
								</div>
								<p style={{ 
									color: 'rgba(255, 255, 255, 0.8)', 
									fontSize: '0.9rem',
									margin: 0,
									lineHeight: '1.6'
								}}>
									{siteSettings?.contactDescription || 'Müşteri Deneyim Ekibimiz ihtiyaçlarınızı aynı gün içinde analiz eder ve ilgili mühendisle buluşturur.'}
								</p>
							</div>
							
							{siteSettings?.address && (
								<div style={{
									display: 'flex',
									alignItems: 'flex-start',
									marginBottom: '1.5rem',
									padding: '1rem',
									background: 'rgba(255, 255, 255, 0.05)',
									borderRadius: '8px',
									transition: 'all 0.3s ease'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
									e.currentTarget.style.transform = 'translateX(5px)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
									e.currentTarget.style.transform = 'translateX(0)';
								}}
								>
									<div style={{
										width: '40px',
										height: '40px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										background: 'linear-gradient(135deg, #FFC107 0%, #FFA000 100%)',
										borderRadius: '8px',
										marginRight: '1rem',
										flexShrink: 0
									}}>
										<i className="flaticon-location" style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: 'bold' }}></i>
									</div>
									<div style={{ flex: 1 }}>
										<span style={{
											color: '#FFC107',
											fontSize: '0.75rem',
											textTransform: 'uppercase',
											letterSpacing: '1px',
											display: 'block',
											marginBottom: '0.5rem',
											fontWeight: '600'
										}}>Merkez Ofis</span>
										<Link 
											href={siteSettings.mapEmbedUrl && siteSettings.mapEmbedUrl.includes('maps/embed') 
												? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteSettings.address)}`
												: siteSettings.mapEmbedUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteSettings.address)}`
											} 
											target="_blank" 
											rel="noopener noreferrer"
											style={{
												color: '#ffffff',
												textDecoration: 'none',
												fontSize: '0.9rem',
												lineHeight: '1.6',
												transition: 'color 0.3s ease',
												display: 'block'
											}}
											onMouseEnter={(e) => e.currentTarget.style.color = '#FFC107'}
											onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
										>
											{siteSettings.address}
										</Link>
									</div>
								</div>
							)}
							
							{siteSettings?.phone && (
								<div style={{
									display: 'flex',
									alignItems: 'flex-start',
									marginBottom: '1.5rem',
									padding: '1rem',
									background: 'rgba(255, 255, 255, 0.05)',
									borderRadius: '8px',
									transition: 'all 0.3s ease'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
									e.currentTarget.style.transform = 'translateX(5px)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
									e.currentTarget.style.transform = 'translateX(0)';
								}}
								>
									<div style={{
										width: '40px',
										height: '40px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										background: 'linear-gradient(135deg, #FFC107 0%, #FFA000 100%)',
										borderRadius: '8px',
										marginRight: '1rem',
										flexShrink: 0
									}}>
										<i className="flaticon-phone" style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: 'bold' }}></i>
									</div>
									<div style={{ flex: 1 }}>
										<Link 
											href={`tel:${siteSettings.phone.replace(/\s/g, '')}`}
											style={{
												color: '#ffffff',
												textDecoration: 'none',
												fontSize: '0.95rem',
												fontWeight: '500',
												transition: 'color 0.3s ease',
												display: 'block',
												lineHeight: '1.6'
											}}
											onMouseEnter={(e) => e.currentTarget.style.color = '#FFC107'}
											onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
										>
											{siteSettings.phone}
										</Link>
									</div>
								</div>
							)}
							
							{siteSettings?.email && (
								<div style={{
									display: 'flex',
									alignItems: 'flex-start',
									marginBottom: '1.5rem',
									padding: '1rem',
									background: 'rgba(255, 255, 255, 0.05)',
									borderRadius: '8px',
									transition: 'all 0.3s ease'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
									e.currentTarget.style.transform = 'translateX(5px)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
									e.currentTarget.style.transform = 'translateX(0)';
								}}
								>
									<div style={{
										width: '40px',
										height: '40px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										background: 'linear-gradient(135deg, #FFC107 0%, #FFA000 100%)',
										borderRadius: '8px',
										marginRight: '1rem',
										flexShrink: 0
									}}>
										<i className="flaticon-email-3" style={{ color: '#1a1a1a', fontSize: '18px', fontWeight: 'bold' }}></i>
									</div>
									<div style={{ flex: 1 }}>
										<Link 
											href={`mailto:${siteSettings.email}`}
											style={{
												color: '#ffffff',
												textDecoration: 'none',
												fontSize: '0.95rem',
												fontWeight: '500',
												transition: 'color 0.3s ease',
												display: 'block',
												wordBreak: 'break-word',
												lineHeight: '1.6'
											}}
											onMouseEnter={(e) => e.currentTarget.style.color = '#FFC107'}
											onMouseLeave={(e) => e.currentTarget.style.color = '#ffffff'}
										>
											{siteSettings.email}
										</Link>
									</div>
								</div>
							)}
							
							{siteSettings?.contactNote && (
								<div style={{
									marginTop: '1.5rem',
									padding: '1rem',
									background: 'rgba(255, 193, 7, 0.1)',
									borderRadius: '8px',
									border: '1px solid rgba(255, 193, 7, 0.2)'
								}}>
									<p style={{
										color: 'rgba(255, 255, 255, 0.9)',
										fontSize: '0.85rem',
										margin: 0,
										lineHeight: '1.6'
									}}>
										{siteSettings.contactNote}
									</p>
								</div>
							)}
							
							{(!siteSettings?.phone && !siteSettings?.email && !siteSettings?.address) && (
								<div style={{
									padding: '1rem',
									background: 'rgba(255, 255, 255, 0.05)',
									borderRadius: '8px',
									textAlign: 'center',
									color: 'rgba(255, 255, 255, 0.6)',
									fontSize: '0.875rem'
								}}>
									İletişim bilgileri yükleniyor...
								</div>
							)}
						</div>
					</div>
					{/* Form - Proje Paylaşım - Sağ Taraf */}
					<div className="col-lg-8 col-md-7 mb-30">
						<div className="contact__panel" style={{
							background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
							padding: '2.5rem',
							borderRadius: '12px',
							border: '1px solid rgba(255, 193, 7, 0.3)',
							borderTop: '2px solid #FFC107',
							borderRight: '2px solid #FFC107',
							boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
							transition: 'all 0.3s ease',
							position: 'relative',
							overflow: 'hidden'
						}}>
							<div className="contact__panel-header" style={{ marginBottom: '1.5rem' }}>
								<h4 style={{ color: '#ffffff', margin: 0, fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
									{siteSettings?.contactFormTitle || 'Projenizi paylaşın'}
								</h4>
								{siteSettings?.contactFormSubtitle && (
									<p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '0.5rem' }}>
										{siteSettings.contactFormSubtitle}
									</p>
								)}
								{siteSettings?.contactFormNote && (
									<p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '0' }}>
										{siteSettings.contactFormNote}
									</p>
								)}
							</div>

							{success && (
								<div className="alert alert-success mb-30" style={{
									padding: '1rem', 
									background: 'rgba(34, 197, 94, 0.2)', 
									color: '#ffffff', 
									borderRadius: '6px',
									border: '1px solid rgba(34, 197, 94, 0.4)',
									marginBottom: '1rem'
								}}>
									Form başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
								</div>
							)}
							{error && (
								<div className="alert alert-error mb-30" style={{
									padding: '1rem', 
									background: 'rgba(239, 68, 68, 0.2)', 
									color: '#ffffff', 
									borderRadius: '6px',
									border: '1px solid rgba(239, 68, 68, 0.4)',
									marginBottom: '1rem'
								}}>
									{error}
								</div>
							)}

							<form ref={formRef} onSubmit={handleSubmit}>
								<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
									<div>
										<label htmlFor="contact-name" style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '500' }}>
											Ad Soyad <span style={{ color: '#FFC107' }}>*</span>
										</label>
										<input 
											id="contact-name" 
											type="text" 
											name="name" 
											placeholder="Örn. Ali Yılmaz" 
											required
											style={{
												width: '100%',
												padding: '0.75rem',
												borderRadius: '6px',
												border: '1px solid rgba(255, 255, 255, 0.2)',
												background: 'rgba(255, 255, 255, 0.1)',
												color: '#ffffff',
												fontSize: '0.9rem',
												transition: 'all 0.3s ease'
											}}
											className="contact-input"
											onFocus={(e) => {
												e.target.style.borderColor = '#FFC107';
												e.target.style.boxShadow = '0 0 0 3px rgba(255, 193, 7, 0.2)';
												e.target.style.background = 'rgba(255, 255, 255, 0.15)';
											}}
											onBlur={(e) => {
												e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
												e.target.style.boxShadow = 'none';
												e.target.style.background = 'rgba(255, 255, 255, 0.1)';
											}}
										/>
									</div>
									<div>
										<label htmlFor="contact-email" style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '500' }}>
											E-posta <span style={{ color: '#FFC107' }}>*</span>
										</label>
										<input 
											id="contact-email" 
											type="email" 
											name="email" 
											placeholder="ornek@domain.com" 
											required
											style={{
												width: '100%',
												padding: '0.75rem',
												borderRadius: '6px',
												border: '1px solid rgba(255, 255, 255, 0.2)',
												background: 'rgba(255, 255, 255, 0.1)',
												color: '#ffffff',
												fontSize: '0.9rem',
												transition: 'all 0.3s ease'
											}}
											className="contact-input"
											onFocus={(e) => {
												e.target.style.borderColor = '#FFC107';
												e.target.style.boxShadow = '0 0 0 3px rgba(255, 193, 7, 0.2)';
												e.target.style.background = 'rgba(255, 255, 255, 0.15)';
											}}
											onBlur={(e) => {
												e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
												e.target.style.boxShadow = 'none';
												e.target.style.background = 'rgba(255, 255, 255, 0.1)';
											}}
										/>
									</div>
								</div>
								<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
									<div>
										<label htmlFor="contact-phone" style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '500' }}>
											Telefon
										</label>
										<input 
											id="contact-phone" 
											type="text" 
											name="phone" 
											placeholder="+90 ___ ___ __ __"
											style={{
												width: '100%',
												padding: '0.75rem',
												borderRadius: '6px',
												border: '1px solid rgba(255, 255, 255, 0.2)',
												background: 'rgba(255, 255, 255, 0.1)',
												color: '#ffffff',
												fontSize: '0.9rem',
												transition: 'all 0.3s ease'
											}}
											className="contact-input"
											onFocus={(e) => {
												e.target.style.borderColor = '#FFC107';
												e.target.style.boxShadow = '0 0 0 3px rgba(255, 193, 7, 0.2)';
												e.target.style.background = 'rgba(255, 255, 255, 0.15)';
											}}
											onBlur={(e) => {
												e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
												e.target.style.boxShadow = 'none';
												e.target.style.background = 'rgba(255, 255, 255, 0.1)';
											}}
										/>
									</div>
									<div>
										<label htmlFor="contact-file" style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '500' }}>
											Dosya Ekle (ZIP veya PDF) <span style={{ fontSize: '0.75rem', opacity: 0.7, fontWeight: 'normal' }}>(Opsiyonel, Max 10MB)</span>
										</label>
										<input 
											id="contact-file" 
											type="file" 
											accept=".zip,.pdf"
											onChange={handleFileChange}
											style={{
												width: '100%',
												padding: '0.75rem',
												borderRadius: '6px',
												border: '1px solid rgba(255, 255, 255, 0.2)',
												background: 'rgba(255, 255, 255, 0.1)',
												color: '#ffffff',
												fontSize: '0.9rem',
												transition: 'all 0.3s ease'
											}}
											className="contact-input"
											onFocus={(e) => {
												e.target.style.borderColor = '#FFC107';
												e.target.style.boxShadow = '0 0 0 3px rgba(255, 193, 7, 0.2)';
												e.target.style.background = 'rgba(255, 255, 255, 0.15)';
											}}
											onBlur={(e) => {
												e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
												e.target.style.boxShadow = 'none';
												e.target.style.background = 'rgba(255, 255, 255, 0.1)';
											}}
										/>
										{selectedFile && (
											<div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.8)' }}>
												{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
											</div>
										)}
									</div>
								</div>
								<div style={{ marginBottom: '1rem' }}>
									<label htmlFor="contact-message" style={{ display: 'block', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '0.4rem', fontSize: '0.875rem', fontWeight: '500' }}>
										İhtiyaç detayları <span style={{ color: '#FFC107' }}>*</span>
									</label>
									<textarea 
										id="contact-message" 
										name="message" 
										placeholder="Kaldırma kuvveti, hız, strok, ortam bilgisi..." 
										rows="4" 
										required
										style={{
											width: '100%',
											padding: '0.75rem',
											borderRadius: '6px',
											border: '1px solid rgba(255, 255, 255, 0.2)',
											background: 'rgba(255, 255, 255, 0.1)',
											color: '#ffffff',
											fontSize: '0.9rem',
											resize: 'vertical',
											transition: 'all 0.3s ease'
										}}
										className="contact-input"
										onFocus={(e) => {
											e.target.style.borderColor = '#FFC107';
											e.target.style.boxShadow = '0 0 0 3px rgba(255, 193, 7, 0.2)';
											e.target.style.background = 'rgba(255, 255, 255, 0.15)';
										}}
										onBlur={(e) => {
											e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
											e.target.style.boxShadow = 'none';
											e.target.style.background = 'rgba(255, 255, 255, 0.1)';
										}}
									></textarea>
								</div>
								<div style={{ marginBottom: '1rem' }}>
									<label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem', position: 'relative' }}>
										<input 
											type="checkbox" 
											checked={kvkkAccepted}
											onChange={(e) => {
												if (!e.target.checked) {
													setKvkkAccepted(false);
												} else {
													setKvkkAccepted(true);
												}
											}}
											style={{ 
												marginRight: '0.5rem', 
												marginTop: '0.25rem', 
												zIndex: 1,
												width: '18px',
												height: '18px',
												accentColor: '#FFC107'
											}}
										/>
										<span style={{ position: 'relative', zIndex: 1 }}>
											KVKK metnini{' '}
											<button
												type="button"
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													setKvkkModalOpen(true);
												}}
												style={{
													background: 'transparent',
													border: 'none',
													color: '#FFC107',
													textDecoration: 'underline',
													cursor: 'pointer',
													padding: '2px 4px',
													fontSize: 'inherit',
													fontWeight: '600',
													pointerEvents: 'auto',
													zIndex: 100,
													position: 'relative',
													display: 'inline-block'
												}}
												onMouseEnter={(e) => {
													e.currentTarget.style.color = '#FFD54F';
													e.currentTarget.style.textDecoration = 'underline';
													e.currentTarget.style.backgroundColor = 'rgba(255, 193, 7, 0.2)';
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.color = '#FFC107';
													e.currentTarget.style.textDecoration = 'underline';
													e.currentTarget.style.backgroundColor = 'transparent';
												}}
											>
												okudum
											</button>
											, verilerimin işlenmesini onaylıyorum. <span style={{ color: '#FFC107' }}>*</span>
										</span>
									</label>
								</div>
								<button 
									type="submit" 
									disabled={loading}
									className="build_button"
									style={{
										width: '100%',
										background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
										color: '#ffffff',
										padding: '1rem 1.5rem',
										borderRadius: '6px',
										border: 'none',
										cursor: loading ? 'not-allowed' : 'pointer',
										fontSize: '1rem',
										fontWeight: '600',
										textTransform: 'uppercase',
										letterSpacing: '1px',
										marginBottom: '0.75rem',
										transition: 'all 0.3s ease',
										position: 'relative',
										overflow: 'hidden',
										boxShadow: loading ? 'none' : '0 4px 15px rgba(255, 107, 53, 0.3)'
									}}
									onMouseEnter={(e) => {
										if (!loading) {
											e.currentTarget.style.transform = 'translateY(-2px)';
											e.currentTarget.style.boxShadow = '0 6px 25px rgba(255, 107, 53, 0.5)';
											e.currentTarget.style.background = 'linear-gradient(135deg, #FF7B45 0%, #FFA133 100%)';
										}
									}}
									onMouseLeave={(e) => {
										if (!loading) {
											e.currentTarget.style.transform = 'translateY(0)';
											e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)';
											e.currentTarget.style.background = 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)';
										}
									}}
								>
									{loading ? 'Gönderiliyor...' : 'GÖNDER'}
								</button>
								<p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', textAlign: 'center', margin: 0 }}>
									Gönderimler TLS korumalıdır ve verileriniz yalnızca proje süresince saklanır.
								</p>
							</form>
						</div>
					</div>
				</div>
			</div>
			<KvkkModal 
				isOpen={kvkkModalOpen}
				onClose={() => setKvkkModalOpen(false)}
				onAccept={() => {
					setKvkkAccepted(true);
					setKvkkModalOpen(false);
				}}
				kvkkText={kvkkText}
			/>
			<style jsx global>{`
				/* Contact Input Placeholder Styles */
				.contact-input::placeholder {
					color: rgba(255, 255, 255, 0.5) !important;
					opacity: 1;
				}
				.contact-input::-webkit-input-placeholder {
					color: rgba(255, 255, 255, 0.5) !important;
					opacity: 1;
				}
				.contact-input::-moz-placeholder {
					color: rgba(255, 255, 255, 0.5) !important;
					opacity: 1;
				}
				.contact-input:-ms-input-placeholder {
					color: rgba(255, 255, 255, 0.5) !important;
					opacity: 1;
				}
				.contact-input:-moz-placeholder {
					color: rgba(255, 255, 255, 0.5) !important;
					opacity: 1;
				}
				.contact-input:focus::placeholder {
					color: rgba(255, 255, 255, 0.7) !important;
				}
				/* File input text color */
				.contact-input[type="file"] {
					color: rgba(255, 255, 255, 0.8) !important;
				}
				.contact-input[type="file"]::file-selector-button {
					background: rgba(255, 193, 7, 0.2);
					color: #FFC107;
					border: 1px solid #FFC107;
					padding: 0.5rem 1rem;
					border-radius: 4px;
					cursor: pointer;
					margin-right: 1rem;
					transition: all 0.3s ease;
				}
				.contact-input[type="file"]::file-selector-button:hover {
					background: rgba(255, 193, 7, 0.3);
				}
				/* Contact Section Responsive */
				@media (max-width: 991px) {
					.contact__section .row > div {
						margin-bottom: 2rem !important;
					}
					.contact__info-card {
						margin-top: 0 !important;
					}
				}
				@media (max-width: 767px) {
					.contact__section {
						padding: 60px 0 !important;
					}
					.contact__panel,
					.contact__info-card {
						padding: 1.5rem !important;
					}
				}
			`}</style>
		</div>
	);
};

export default ContactSection;

