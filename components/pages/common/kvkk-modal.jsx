"use client"
import React from 'react';

const KvkkModal = ({ isOpen, onClose, onAccept, kvkkText }) => {
	if (!isOpen) return null;

	return (
		<div 
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				background: 'rgba(0, 0, 0, 0.8)',
				zIndex: 9999,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '2rem'
			}}
			onClick={onClose}
		>
			<div 
				style={{
					background: 'var(--color-2)',
					borderRadius: '12px',
					maxWidth: '800px',
					width: '100%',
					maxHeight: '90vh',
					overflow: 'hidden',
					display: 'flex',
					flexDirection: 'column',
					boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<div style={{
					padding: '1.5rem 2rem',
					borderBottom: '1px solid var(--border-color-1)',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center'
				}}>
					<h3 style={{ margin: 0, color: 'var(--text-heading-color)' }}>KVKK Aydınlatma Metni</h3>
					<button
						onClick={onClose}
						style={{
							background: 'transparent',
							border: 'none',
							fontSize: '1.5rem',
							cursor: 'pointer',
							color: 'var(--body-color)',
							padding: 0,
							width: '30px',
							height: '30px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						×
					</button>
				</div>
				<div style={{
					padding: '2rem',
					overflowY: 'auto',
					flex: 1,
					color: 'var(--body-color)',
					lineHeight: '1.8'
				}}>
					{kvkkText ? (
						<div dangerouslySetInnerHTML={{ __html: kvkkText.replace(/\n/g, '<br />') }} />
					) : (
						<div>
							<h4 style={{ color: 'var(--text-heading-color)', marginBottom: '1rem' }}>Kişisel Verilerin Korunması Kanunu Aydınlatma Metni</h4>
							<p>
								Alpdinamik olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, kişisel verilerinizin işlenmesi hakkında sizleri bilgilendirmek isteriz.
							</p>
							<h5 style={{ color: 'var(--text-heading-color)', marginTop: '1.5rem', marginBottom: '0.75rem' }}>1. Veri Sorumlusu</h5>
							<p>
								Kişisel verileriniz, Alpdinamik tarafından veri sorumlusu sıfatıyla işlenmektedir.
							</p>
							<h5 style={{ color: 'var(--text-heading-color)', marginTop: '1.5rem', marginBottom: '0.75rem' }}>2. İşlenen Kişisel Veriler</h5>
							<p>
								Form aracılığıyla toplanan ad, soyad, e-posta adresi, telefon numarası ve mesaj içeriği gibi kişisel verileriniz işlenmektedir.
							</p>
							<h5 style={{ color: 'var(--text-heading-color)', marginTop: '1.5rem', marginBottom: '0.75rem' }}>3. İşleme Amaçları</h5>
							<p>
								Kişisel verileriniz, iletişim taleplerinizin karşılanması, teknik destek sağlanması ve proje tekliflerinin hazırlanması amacıyla işlenmektedir.
							</p>
							<h5 style={{ color: 'var(--text-heading-color)', marginTop: '1.5rem', marginBottom: '0.75rem' }}>4. Verilerin Paylaşılması</h5>
							<p>
								Kişisel verileriniz, yalnızca yukarıda belirtilen amaçlar doğrultusunda ve yasal yükümlülüklerimiz çerçevesinde işlenmekte olup, üçüncü kişilerle paylaşılmamaktadır.
							</p>
							<h5 style={{ color: 'var(--text-heading-color)', marginTop: '1.5rem', marginBottom: '0.75rem' }}>5. Haklarınız</h5>
							<p>
								KVKK'nın 11. maddesi uyarınca, kişisel verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme, silinmesini veya yok edilmesini isteme, düzeltme, silme, yok etme işlemlerinin kişisel verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme, münhasıran otomatik sistemler ile analiz edilmesi nedeniyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme ve kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme haklarına sahipsiniz.
							</p>
							<h5 style={{ color: 'var(--text-heading-color)', marginTop: '1.5rem', marginBottom: '0.75rem' }}>6. İletişim</h5>
							<p>
								KVKK kapsamındaki haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.
							</p>
						</div>
					)}
				</div>
				<div style={{
					padding: '1.5rem 2rem',
					borderTop: '1px solid var(--border-color-1)',
					display: 'flex',
					gap: '1rem',
					justifyContent: 'flex-end'
				}}>
					<button
						onClick={onClose}
						style={{
							padding: '0.75rem 1.5rem',
							background: 'transparent',
							border: '1px solid var(--border-color-1)',
							borderRadius: '4px',
							cursor: 'pointer',
							color: 'var(--body-color)'
						}}
					>
						Kapat
					</button>
					<button
						onClick={onAccept}
						className="build_button"
						style={{
							padding: '0.75rem 1.5rem'
						}}
					>
						Kabul Ediyorum
					</button>
				</div>
			</div>
		</div>
	);
};

export default KvkkModal;

