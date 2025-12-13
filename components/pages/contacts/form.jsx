"use client"
import React, { useState, useEffect, useRef } from 'react';
import KvkkModal from '../common/kvkk-modal';

const FormArea = () => {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState('');
	const [kvkkModalOpen, setKvkkModalOpen] = useState(false);
	const [kvkkAccepted, setKvkkAccepted] = useState(false);
	const [kvkkText, setKvkkText] = useState('');
	const [selectedFile, setSelectedFile] = useState(null);
	const formRef = useRef(null);

	useEffect(() => {
		async function fetchKvkkText() {
			try {
				const response = await fetch('/api/site-settings');
				if (response.ok) {
					const data = await response.json();
					setKvkkText(data.kvkkText || '');
				}
			} catch (error) {
				console.error('Error fetching KVKK text:', error);
			}
		}
		fetchKvkkText();
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
			setSuccess(false);
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
					fileUrl = uploadData.absoluteUrl || uploadData.url;
				} else {
					throw new Error('Dosya yüklenemedi');
				}
			} catch (err) {
				console.error('File upload error:', err);
				setError('Dosya yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
				setSuccess(false);
				setLoading(false);
				return;
			}
		}

		const data = {
			fullName: formData.get('name'),
			email: formData.get('email'),
			phone: formData.get('phone') || '',
			message: formData.get('message') || formData.get('subject') || '',
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
				setError('');
				if (formRef.current) {
					formRef.current.reset();
				} else if (e.currentTarget) {
					e.currentTarget.reset();
				}
				setSelectedFile(null);
				setKvkkAccepted(false);
			} else {
				setSuccess(false);
				setError(result.error?.message || 'Bir hata oluştu');
			}
		} catch (err) {
			console.error('Error:', err);
			setSuccess(false);
			setError('Form gönderilirken bir hata oluştu');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{success && (
				<div style={{
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
				<div style={{
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

			<form ref={formRef} onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
				<div className="row">
					<div className="col-md-6 mb-25">
						<div className="contact__form-area-item">
							<input 
								type="text" 
								name="name" 
								placeholder="Ad Soyad" 
								required 
								style={{
									width: '100%',
									padding: '0.875rem 1.25rem',
									border: '1px solid var(--border-color-1)',
									borderRadius: '8px',
									background: 'var(--bg-white)',
									color: 'var(--text-heading-color)',
									fontSize: '0.95rem',
									transition: 'all 0.3s ease',
									outline: 'none'
								}}
								onFocus={(e) => {
									e.target.style.borderColor = 'var(--primary-color-1)';
									e.target.style.boxShadow = '0 0 0 3px rgba(255, 191, 67, 0.1)';
								}}
								onBlur={(e) => {
									e.target.style.borderColor = 'var(--border-color-1)';
									e.target.style.boxShadow = 'none';
								}}
							/>
						</div>
					</div>
					<div className="col-md-6 md-mb-25">
						<div className="contact__form-area-item">
							<input 
								type="email" 
								name="email" 
								placeholder="E-posta" 
								required 
								style={{
									width: '100%',
									padding: '0.875rem 1.25rem',
									border: '1px solid var(--border-color-1)',
									borderRadius: '8px',
									background: 'var(--bg-white)',
									color: 'var(--text-heading-color)',
									fontSize: '0.95rem',
									transition: 'all 0.3s ease',
									outline: 'none'
								}}
								onFocus={(e) => {
									e.target.style.borderColor = 'var(--primary-color-1)';
									e.target.style.boxShadow = '0 0 0 3px rgba(255, 191, 67, 0.1)';
								}}
								onBlur={(e) => {
									e.target.style.borderColor = 'var(--border-color-1)';
									e.target.style.boxShadow = 'none';
								}}
							/>
						</div>
					</div>
					<div className="col-md-6 mb-25">
						<div className="contact__form-area-item">
							<input 
								type="text" 
								name="phone" 
								placeholder="Telefon" 
								style={{
									width: '100%',
									padding: '0.875rem 1.25rem',
									border: '1px solid var(--border-color-1)',
									borderRadius: '8px',
									background: 'var(--bg-white)',
									color: 'var(--text-heading-color)',
									fontSize: '0.95rem',
									transition: 'all 0.3s ease',
									outline: 'none'
								}}
								onFocus={(e) => {
									e.target.style.borderColor = 'var(--primary-color-1)';
									e.target.style.boxShadow = '0 0 0 3px rgba(255, 191, 67, 0.1)';
								}}
								onBlur={(e) => {
									e.target.style.borderColor = 'var(--border-color-1)';
									e.target.style.boxShadow = 'none';
								}}
							/>
						</div>
					</div>
					<div className="col-md-6 mb-25">
						<div className="contact__form-area-item">
							<label style={{
								display: 'block',
								width: '100%',
								padding: '0.875rem 1.25rem',
								border: '1px solid var(--border-color-1)',
								borderRadius: '8px',
								background: 'var(--bg-white)',
								color: 'var(--text-heading-color)',
								fontSize: '0.95rem',
								cursor: 'pointer',
								transition: 'all 0.3s ease',
								textAlign: 'center'
							}}>
								<input 
									type="file" 
									accept=".zip,.pdf" 
									onChange={handleFileChange} 
									style={{ display: 'none' }}
								/>
								<span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
									<i className="flaticon-file" style={{ fontSize: '1.2rem' }}></i>
									{selectedFile ? selectedFile.name : 'Dosya Seç (ZIP/PDF, Max 10MB)'}
								</span>
							</label>
							{selectedFile && (
								<p style={{ 
									marginTop: '0.5rem', 
									fontSize: '0.85rem', 
									color: 'var(--body-color)',
									display: 'flex',
									alignItems: 'center',
									gap: '0.5rem'
								}}>
									<i className="flaticon-check" style={{ color: 'var(--primary-color-1)' }}></i>
									{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
								</p>
							)}
						</div>
					</div>
					<div className="col-md-12 mb-25">
						<div className="contact__form-area-item">
							<input 
								type="text" 
								name="subject" 
								placeholder="Konu" 
								style={{
									width: '100%',
									padding: '0.875rem 1.25rem',
									border: '1px solid var(--border-color-1)',
									borderRadius: '8px',
									background: 'var(--bg-white)',
									color: 'var(--text-heading-color)',
									fontSize: '0.95rem',
									transition: 'all 0.3s ease',
									outline: 'none'
								}}
								onFocus={(e) => {
									e.target.style.borderColor = 'var(--primary-color-1)';
									e.target.style.boxShadow = '0 0 0 3px rgba(255, 191, 67, 0.1)';
								}}
								onBlur={(e) => {
									e.target.style.borderColor = 'var(--border-color-1)';
									e.target.style.boxShadow = 'none';
								}}
							/>
						</div>
					</div>
					<div className="col-md-12 mb-25">
						<div className="contact__form-area-item">
							<textarea 
								name="message" 
								placeholder="Proje / İhtiyaç Detayı" 
								rows="4" 
								required
								style={{
									width: '100%',
									padding: '0.875rem 1.25rem',
									border: '1px solid var(--border-color-1)',
									borderRadius: '8px',
									background: 'var(--bg-white)',
									color: 'var(--text-heading-color)',
									fontSize: '0.95rem',
									transition: 'all 0.3s ease',
									outline: 'none',
									resize: 'vertical',
									fontFamily: 'inherit'
								}}
								onFocus={(e) => {
									e.target.style.borderColor = 'var(--primary-color-1)';
									e.target.style.boxShadow = '0 0 0 3px rgba(255, 191, 67, 0.1)';
								}}
								onBlur={(e) => {
									e.target.style.borderColor = 'var(--border-color-1)';
									e.target.style.boxShadow = 'none';
								}}
							></textarea>
						</div>
					</div>
					<div className="col-md-12 mb-25">
						<div className="contact__form-area-item">
							<label style={{ 
								display: 'flex', 
								alignItems: 'flex-start', 
								gap: '0.75rem', 
								cursor: 'pointer',
								padding: '0.75rem',
								borderRadius: '8px',
								background: 'rgba(255, 255, 255, 0.05)',
								border: '1px solid rgba(255, 255, 255, 0.1)',
								transition: 'all 0.3s ease'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
							}}
							>
								<input 
									type="checkbox" 
									checked={kvkkAccepted}
									onChange={(e) => setKvkkAccepted(e.target.checked)}
									style={{ 
										marginTop: '0.25rem',
										width: '18px',
										height: '18px',
										cursor: 'pointer',
										accentColor: 'var(--primary-color-1)'
									}}
								/>
								<span style={{ 
									fontSize: '0.9rem', 
									color: 'var(--body-color)',
									lineHeight: '1.6'
								}}>
									KVKK metnini{' '}
									<button
										type="button"
										onClick={(e) => {
											e.preventDefault();
											setKvkkModalOpen(true);
										}}
										style={{
											background: 'none',
											border: 'none',
											color: 'var(--primary-color-1)',
											textDecoration: 'underline',
											cursor: 'pointer',
											padding: 0,
											fontSize: 'inherit',
											fontWeight: '500'
										}}
									>
										okudum
									</button>
									{' '}ve verilerimin işlenmesini onaylıyorum. <span style={{ color: 'var(--primary-color-1)' }}>*</span>
								</span>
							</label>
						</div>
					</div>
					<div className="col-md-12">
						<div className="contact__form-area-item">
							<button 
								className="build_button" 
								type="submit" 
								disabled={loading}
								style={{ 
									opacity: loading ? 0.6 : 1, 
									cursor: loading ? 'not-allowed' : 'pointer',
									width: '100%',
									padding: '1rem 2rem',
									fontSize: '1rem',
									fontWeight: '600',
									transition: 'all 0.3s ease'
								}}
							>
								{loading ? 'Gönderiliyor...' : 'Mesaj Gönder'} <i className="flaticon-right-up"></i>
							</button>
						</div>
					</div>
				</div>
			</form>

			<KvkkModal
				isOpen={kvkkModalOpen}
				onClose={() => setKvkkModalOpen(false)}
				onAccept={() => {
					setKvkkAccepted(true);
					setKvkkModalOpen(false);
				}}
				kvkkText={kvkkText}
			/>
		</>
	);
};

export default FormArea;
