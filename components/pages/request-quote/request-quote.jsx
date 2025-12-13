"use client"
import React, { useState } from 'react';

const RequestQuoteMain = () => {
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError('');
		setSuccess(false);
		
		const formData = new FormData(e.currentTarget);
		const file = formData.get('file');
		
		const data = {
			fullName: formData.get('name'),
			email: formData.get('email'),
			phone: formData.get('phone'),
			message: formData.get('message'),
			source: 'PROJECT_FORM',
			meta: {
				kvkk: formData.get('kvkk') === 'on',
			},
		};

		if (file && file.size > 0) {
			data.meta.fileName = file.name;
			data.meta.fileSize = file.size;
			// TODO: File upload için ayrı endpoint gerekebilir
		}

		try {
			const response = await fetch('/api/leads', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (response.ok && result.success) {
				setSuccess(true);
				e.currentTarget.reset();
			} else {
				setError(result.error?.message || 'Bir hata oluştu');
			}
		} catch (err) {
			console.error('Error:', err);
			setError('Form gönderilirken bir hata oluştu');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="request__quote section-padding-three">
				<div className="container">
					<div className="row">
						<div className="col-xl-12">
							<div className="request__quote-header mb-40">
								<h2 className="mb-15">Projenizi paylaşın</h2>
								<p className="mb-20">Kısa formu doldurun; en geç 2 iş saati içinde CAD veya teklif dosya paylaşımı için dönüş.</p>
								<p className="text-s" style={{opacity: 0.85}}>CAD & FEM doğrulama gerektiren taleplerde örnek çizim eklemek süreci hızlandırır.</p>
							</div>
							{success && (
								<div className="alert alert-success mb-30" style={{
									padding: '1rem', 
									background: 'var(--color-2)', 
									color: 'var(--body-color)', 
									borderRadius: '4px',
									border: '1px solid var(--border-color-1)'
								}}>
									Form başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
								</div>
							)}
							{error && (
								<div className="alert alert-error mb-30" style={{
									padding: '1rem', 
									background: 'var(--color-2)', 
									color: 'var(--body-color)', 
									borderRadius: '4px',
									border: '1px solid var(--border-color-1)'
								}}>
									{error}
								</div>
							)}
							<form onSubmit={handleSubmit} method="post" encType="multipart/form-data">
								<div className="row">
									<div className="col-md-6 mt-30">
										<div className="request__quote-item">
											<label htmlFor="contact-name">Ad Soyad<span> *</span></label>
											<input id="contact-name" type="text" name="name" placeholder="Örn. Ali Yılmaz" required />
										</div>
									</div>
									<div className="col-md-6 mt-30">
										<div className="request__quote-item">
											<label htmlFor="contact-email">E-posta<span> *</span></label>
											<input id="contact-email" type="email" name="email" placeholder="ornek@domain.com" required />
										</div>
									</div>
									<div className="col-md-6 mt-30">
										<div className="request__quote-item">
											<label htmlFor="contact-phone">Telefon</label>
											<input id="contact-phone" type="text" name="phone" placeholder="+90 ___ ___ __ __" />
										</div>
									</div>
									<div className="col-md-6 mt-30">
										<div className="request__quote-item">
											<label htmlFor="contact-file">Dosya Ekle (Opsiyonel)</label>
											<input id="contact-file" type="file" name="file" accept=".pdf,.dwg,.dxf,.step,.stp,.jpg,.jpeg,.png" />
											<small className="text-muted">PDF, DWG, DXF, STEP, STP, JPG, PNG formatları desteklenir.</small>
										</div>
									</div>
									<div className="col-md-12 mt-30">
										<div className="request__quote-item">
											<label htmlFor="contact-message">İhtiyaç detayları<span> *</span></label>
											<textarea id="contact-message" name="message" placeholder="Kaldırma kuvveti, hız, strok, ortam bilgisi..." rows="4" required></textarea>
										</div>
									</div>
									<div className="col-md-12 mt-30">
										<div className="request__quote-item">
											<label className="checkbox-inline" style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
												<input type="checkbox" name="kvkk" required style={{marginRight: '10px'}} />
												<span>KVKK metnini okudum, verilerimin işlenmesini onaylıyorum.<span> *</span></span>
											</label>
										</div>
									</div>
									<div className="col-lg-12 mt-30">
										<button className="build_button" type="submit" disabled={loading}>
											{loading ? 'Gönderiliyor...' : 'Gönder'}<i className="flaticon-right-up"></i>
										</button>
									</div>
									<div className="col-lg-12 mt-20">
										<p className="text-xs text-center" style={{opacity: 0.8, fontSize: '12px'}}>Gönderimler TLS korumalıdır ve verileriniz yalnızca proje süresince saklanır.</p>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default RequestQuoteMain;