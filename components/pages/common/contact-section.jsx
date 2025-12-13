"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import KvkkModal from './kvkk-modal';

const ContactSection = () => {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState('');
	const [kvkkModalOpen, setKvkkModalOpen] = useState(false);
	const [kvkkAccepted, setKvkkAccepted] = useState(false);
	const [kvkkText, setKvkkText] = useState('');
	const [selectedFile, setSelectedFile] = useState(null);
	const [siteSettings, setSiteSettings] = useState(null);
	const formRef = React.useRef(null);

	useEffect(() => {
		async function fetchSiteSettings() {
			try {
				const response = await fetch('/api/site-settings');
				if (response.ok) {
					const data = await response.json();
					setKvkkText(data.kvkkText || '');
					setSiteSettings(data);
				}
			} catch (error) {
				console.error('Error fetching site settings:', error);
			}
		}
		fetchSiteSettings();
	}, []);

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
				<div className="row justify-content-center">
					{/* Ortalanmış Form - Proje Paylaşım */}
					<div className="col-lg-6 col-md-8 col-12 mb-30">
						<div className="contact__panel" style={{
							background: 'var(--bg-white)',
							padding: '2rem',
							borderRadius: '12px',
							border: '1px solid rgba(0, 0, 0, 0.08)',
							boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
							transition: 'all 0.3s ease',
							position: 'relative',
							overflow: 'hidden'
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.transform = 'translateY(-2px)';
							e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.12)';
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.transform = 'translateY(0)';
							e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
						}}
						>
							<div className="contact__panel-header" style={{ marginBottom: '1rem' }}>
								<div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
									<i className="flaticon-file" style={{ 
										fontSize: '1.5rem', 
										color: 'var(--primary-color-1)',
										transition: 'all 0.3s ease',
										display: 'inline-block'
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.transform = 'scale(1.15) rotate(-5deg)';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
									}}
									></i>
									<h4 style={{ color: 'var(--text-heading-color)', margin: 0, fontSize: '1.25rem' }}>
										{siteSettings?.contactFormTitle || 'Projenizi paylaşın'}
									</h4>
								</div>
								{siteSettings?.contactFormSubtitle && (
									<p style={{ color: 'var(--body-color)', fontSize: '0.875rem', lineHeight: '1.5', marginBottom: '0.4rem' }}>
										{siteSettings.contactFormSubtitle}
									</p>
								)}
								{siteSettings?.contactFormNote && (
									<p style={{ color: 'var(--body-color)', fontSize: '0.8rem', lineHeight: '1.5', opacity: 0.85 }}>
										{siteSettings.contactFormNote}
									</p>
								)}
							</div>

							{success && (
								<div className="alert alert-success mb-30" style={{
									padding: '1rem', 
									background: 'rgba(34, 197, 94, 0.2)', 
									color: 'var(--text-heading-color)', 
									borderRadius: '4px',
									border: '1px solid rgba(34, 197, 94, 0.3)',
									marginBottom: '1rem'
								}}>
									Form başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
								</div>
							)}
							{error && (
								<div className="alert alert-error mb-30" style={{
									padding: '1rem', 
									background: 'rgba(239, 68, 68, 0.2)', 
									color: 'var(--text-heading-color)', 
									borderRadius: '4px',
									border: '1px solid rgba(239, 68, 68, 0.3)',
									marginBottom: '1rem'
								}}>
									{error}
								</div>
							)}

							<form ref={formRef} onSubmit={handleSubmit}>
								<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
									<div>
										<label htmlFor="contact-name" style={{ display: 'block', color: 'var(--body-color)', marginBottom: '0.4rem', fontSize: '0.875rem' }}>
											Ad Soyad <span style={{ color: 'var(--primary-color-1)' }}>*</span>
										</label>
										<input 
											id="contact-name" 
											type="text" 
											name="name" 
											placeholder="Örn. Ali Yılmaz" 
											required
											style={{
												width: '100%',
												padding: '0.6rem',
												borderRadius: '4px',
												border: '1px solid var(--border-color-1)',
												background: 'var(--bg-white)',
												color: 'var(--text-heading-color)',
												fontSize: '0.875rem',
												transition: 'all 0.3s ease'
											}}
											onFocus={(e) => {
												e.target.style.borderColor = 'var(--primary-color-1)';
												e.target.style.boxShadow = '0 0 0 3px rgba(255, 191, 67, 0.1)';
												e.target.style.transform = 'scale(1.02)';
											}}
											onBlur={(e) => {
												e.target.style.borderColor = 'var(--border-color-1)';
												e.target.style.boxShadow = 'none';
												e.target.style.transform = 'scale(1)';
											}}
										/>
									</div>
									<div>
										<label htmlFor="contact-email" style={{ display: 'block', color: 'var(--body-color)', marginBottom: '0.4rem', fontSize: '0.875rem' }}>
											E-posta <span style={{ color: 'var(--primary-color-1)' }}>*</span>
										</label>
										<input 
											id="contact-email" 
											type="email" 
											name="email" 
											placeholder="ornek@domain.com" 
											required
											style={{
												width: '100%',
												padding: '0.6rem',
												borderRadius: '4px',
												border: '1px solid var(--border-color-1)',
												background: 'var(--bg-white)',
												color: 'var(--text-heading-color)',
												fontSize: '0.875rem',
												transition: 'all 0.3s ease'
											}}
											onFocus={(e) => {
												e.target.style.borderColor = 'var(--primary-color-1)';
												e.target.style.boxShadow = '0 0 0 3px rgba(255, 191, 67, 0.1)';
												e.target.style.transform = 'scale(1.02)';
											}}
											onBlur={(e) => {
												e.target.style.borderColor = 'var(--border-color-1)';
												e.target.style.boxShadow = 'none';
												e.target.style.transform = 'scale(1)';
											}}
										/>
									</div>
								</div>
								<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
									<div>
										<label htmlFor="contact-phone" style={{ display: 'block', color: 'var(--body-color)', marginBottom: '0.4rem', fontSize: '0.875rem' }}>
											Telefon
										</label>
										<input 
											id="contact-phone" 
											type="text" 
											name="phone" 
											placeholder="+90 ___ ___ __ __"
											style={{
												width: '100%',
												padding: '0.6rem',
												borderRadius: '4px',
												border: '1px solid var(--border-color-1)',
												background: 'var(--bg-white)',
												color: 'var(--text-heading-color)',
												fontSize: '0.875rem',
												transition: 'all 0.3s ease'
											}}
											onFocus={(e) => {
												e.target.style.borderColor = 'var(--primary-color-1)';
												e.target.style.boxShadow = '0 0 0 3px rgba(255, 191, 67, 0.1)';
												e.target.style.transform = 'scale(1.02)';
											}}
											onBlur={(e) => {
												e.target.style.borderColor = 'var(--border-color-1)';
												e.target.style.boxShadow = 'none';
												e.target.style.transform = 'scale(1)';
											}}
										/>
									</div>
									<div>
										<label htmlFor="contact-file" style={{ display: 'block', color: 'var(--body-color)', marginBottom: '0.4rem', fontSize: '0.875rem' }}>
											Dosya Ekle (ZIP veya PDF) <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>(Opsiyonel, Max 10MB)</span>
										</label>
										<input 
											id="contact-file" 
											type="file" 
											accept=".zip,.pdf"
											onChange={handleFileChange}
											style={{
												width: '100%',
												padding: '0.6rem',
												borderRadius: '4px',
												border: '1px solid var(--border-color-1)',
												background: 'var(--bg-white)',
												color: 'var(--text-heading-color)',
												fontSize: '0.875rem',
												transition: 'all 0.3s ease'
											}}
											onFocus={(e) => {
												e.target.style.borderColor = 'var(--primary-color-1)';
												e.target.style.boxShadow = '0 0 0 3px rgba(255, 191, 67, 0.1)';
												e.target.style.transform = 'scale(1.02)';
											}}
											onBlur={(e) => {
												e.target.style.borderColor = 'var(--border-color-1)';
												e.target.style.boxShadow = 'none';
												e.target.style.transform = 'scale(1)';
											}}
										/>
										{selectedFile && (
											<div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--body-color)' }}>
												{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
											</div>
										)}
									</div>
								</div>
								<div style={{ marginBottom: '1rem' }}>
									<label htmlFor="contact-message" style={{ display: 'block', color: 'var(--body-color)', marginBottom: '0.4rem', fontSize: '0.875rem' }}>
										İhtiyaç detayları <span style={{ color: 'var(--primary-color-1)' }}>*</span>
									</label>
									<textarea 
										id="contact-message" 
										name="message" 
										placeholder="Kaldırma kuvveti, hız, strok, ortam bilgisi..." 
										rows="3" 
										required
										style={{
											width: '100%',
											padding: '0.6rem',
											borderRadius: '4px',
											border: '1px solid var(--border-color-1)',
											background: 'var(--bg-white)',
											color: 'var(--text-heading-color)',
											fontSize: '0.875rem',
											resize: 'vertical',
											transition: 'all 0.3s ease'
										}}
										onFocus={(e) => {
											e.target.style.borderColor = 'var(--primary-color-1)';
											e.target.style.boxShadow = '0 0 0 3px rgba(255, 191, 67, 0.1)';
											e.target.style.transform = 'scale(1.01)';
										}}
										onBlur={(e) => {
											e.target.style.borderColor = 'var(--border-color-1)';
											e.target.style.boxShadow = 'none';
											e.target.style.transform = 'scale(1)';
										}}
									></textarea>
								</div>
								<div style={{ marginBottom: '1rem' }}>
									<label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer', color: 'var(--body-color)', fontSize: '0.875rem', position: 'relative' }}>
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
											style={{ marginRight: '0.5rem', marginTop: '0.25rem', zIndex: 1 }}
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
													color: 'var(--primary-color-1)',
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
													e.currentTarget.style.color = '#0056b3';
													e.currentTarget.style.textDecoration = 'underline';
													e.currentTarget.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
												}}
												onMouseLeave={(e) => {
													e.currentTarget.style.color = 'var(--primary-color-1)';
													e.currentTarget.style.textDecoration = 'underline';
													e.currentTarget.style.backgroundColor = 'transparent';
												}}
											>
												okudum
											</button>
											, verilerimin işlenmesini onaylıyorum. <span style={{ color: 'var(--primary-color-1)' }}>*</span>
										</span>
									</label>
								</div>
								<button 
									type="submit" 
									disabled={loading}
									className="build_button"
									style={{
										width: '100%',
										background: 'var(--primary-color-1)',
										color: 'var(--text-white)',
										padding: '0.6rem 1.2rem',
										borderRadius: '4px',
										border: 'none',
										cursor: loading ? 'not-allowed' : 'pointer',
										fontSize: '0.875rem',
										marginBottom: '0.5rem',
										transition: 'all 0.3s ease',
										position: 'relative',
										overflow: 'hidden'
									}}
									onMouseEnter={(e) => {
										if (!loading) {
											e.currentTarget.style.transform = 'translateY(-2px)';
											e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 191, 67, 0.4)';
										}
									}}
									onMouseLeave={(e) => {
										if (!loading) {
											e.currentTarget.style.transform = 'translateY(0)';
											e.currentTarget.style.boxShadow = 'none';
										}
									}}
								>
									{loading ? 'Gönderiliyor...' : 'Gönder'}
								</button>
								<p style={{ fontSize: '0.75rem', color: 'var(--body-color)', textAlign: 'center', margin: 0, opacity: 0.8 }}>
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
		</div>
	);
};

export default ContactSection;

