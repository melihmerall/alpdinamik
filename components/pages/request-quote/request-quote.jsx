import React from 'react';

const RequestQuoteMain = () => {
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
							<form action="#" method="post" encType="multipart/form-data">
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
										<button className="build_button" type="submit">Gönder<i className="flaticon-right-up"></i></button>
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