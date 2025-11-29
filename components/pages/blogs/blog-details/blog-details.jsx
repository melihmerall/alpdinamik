import Link from 'next/link';
import Social from '@/components/data/social';
import BlogSidebar from '../blog-sidebar/blog-sidebar';
import avatar1 from '../../../../public/assets/img/team/member-5.jpg';
import avatar2 from '../../../../public/assets/img/team/member-3.jpg';
import avatar3 from '../../../../public/assets/img/team/member-1.jpg';
import image1 from '../../../../public/assets/img/about/about-1.jpg';
import image2 from '../../../../public/assets/img/page/choose-us.jpg';
import FormArea from '../../contacts/form';
import blogData from '@/components/data/blog-data';

const BlogSingleMain = ({singleData}) => {
    const blogPost = blogData.slice(0, 3);

    return (
        <>
        <div className="blog__details section-padding">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 lg-mb-25">
                        <div className="blog__details-area">
                            <img src={singleData.image.src} alt="image" />
                            <h3 className="mt-25 mb-20">{singleData.title}</h3>
                            <p>{singleData.description}</p>
                            <p>Lineer hareket sistemlerinde doğru ürün seçimi, uygulamanın başarısı için kritik öneme sahiptir. Yük, strok, hız ve çalışma çevrimi gibi parametrelerin detaylı analizi, sistemin güvenli ve verimli çalışmasını sağlar. Alp Dinamik olarak, her projede bu parametreleri dikkate alarak mühendislik odaklı çözümler sunuyoruz.</p>
                            <div className="blog__details-area-box">
                                <i className="fas fa-quote-right"></i>
                                <div>
                                    <h6>Doğru ürün seçimi ve mühendislik desteği, lineer hareket sistemlerinin uzun ömürlü ve güvenilir çalışmasını sağlar</h6>                                
                                    <span>Alp Dinamik Mühendislik Ekibi</span>
                                </div>
                            </div>
                            <h4 className="mb-20">Duty Cycle Analizinin Önemi</h4>
                            <p>Duty cycle, lineer hareket sistemlerinin performansını ve ömrünü belirleyen en önemli faktörlerden biridir. Sistemin ne kadar süre çalışacağı, dinlenme süreleri ve çalışma çevrimi, ürün seçiminde kritik rol oynar. Duty cycle analizi yapılmadan seçilen ürünlerde erken arıza ve performans kayıpları yaşanabilir. Bu nedenle, her uygulama için detaylı duty cycle hesaplaması yapılmalıdır.</p>
                            <div className="row mt-40 mb-40 blog__details-area-image">
                                <div className="col-sm-6 sm-mb-25">
                                    <img src={image1.src} alt="image" />
                                </div>
                                <div className="col-sm-6">
                                    <img src={image2.src} alt="image" />
                                </div>
                            </div>
                            <p>Alp Dinamik olarak, lineer hareket sistemlerinde uzman mühendislik desteği, yenilikçi çözümler ve kalite odaklı yaklaşımımızla projelerinizin başarısını sağlıyoruz. Her uygulamanın kendine özgü gereksinimlerini dikkate alarak, güvenilir ve verimli sistemler kuruyoruz. Detaylı planlama, doğru ürün seçimi ve sürekli teknik destek ile müşteri memnuniyetini ön planda tutuyoruz.</p>
                            <div className="blog__details-area-tag">
                                <h5>İlgili Konular :</h5>
                                <div className="all__sidebar-item-tag">
                                    <ul>
                                        {blogPost.map((data, id) => (
                                            <li key={id}><Link href={`/blog/${data.id}`}>{data.title.split(' ').slice(0, 2).join(' ')}</Link></li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="blog__details-area-author">
                                <div className="blog__details-area-author-image">
                                    <img src={avatar1.src} alt="avatar-image" />
                                </div>
                                <div className="blog__details-area-author-content">
                                    <h5>Alp Dinamik Mühendislik Ekibi</h5>
                                    <p>Lineer hareket sistemlerinde proje tasarımı, ürün seçimi ve teknik destek konularında deneyimli mühendislerimiz, her projede en uygun çözümü sunmak için çalışıyor.</p>
                                    <div className="social__icon">
                                        <Social />
                                    </div>
                                </div>
                            </div>
                            <div className="blog__details-area-comment mt-40">
                                <h3 className="mb-30">Yorumlar (2)</h3>
                                <div className="blog__details-area-comment-item">
                                    <div className="blog__details-area-comment-item-comment">
                                        <div className="blog__details-area-comment-item-comment-image">
                                            <img src={avatar2.src} alt="avatar-image" />	
                                        </div>									
                                        <div className="blog__details-area-comment-item-comment-content">
                                            <h5>Guy Hawkins<Link href="#"><i className="far fa-reply-all"></i>Reply</Link></h5>
                                            <span>20 Dec, 2025  At 9:PM</span>
                                            <p>Pellentesque a placerat orci. Suspendisse rutrum lacus ipsum, eu vulputate augue blandit mollis.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="blog__details-area-comment-item ml-65 sm-ml-0">
                                    <div className="blog__details-area-comment-item-comment">
                                        <div className="blog__details-area-comment-item-comment-image">
                                            <img src={avatar3.src} alt="avatar-image" />
                                        </div>									
                                        <div className="blog__details-area-comment-item-comment-content">
                                            <h5>Kristin Watson<Link href="#"><i className="far fa-reply-all"></i>Reply</Link></h5>
                                            <span>22 Dec, 2025  At 7:PM</span>
                                            <p>Pellentesque a placerat orci. Suspendisse rutrum lacus ipsum, eu vulputate augue blandit mollis.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="blog__details-area-contact mt-60">
                                <h3>Yorum Yapın</h3>
                                <p>E-posta adresiniz yayınlanmayacaktır. Gerekli alanlar işaretlenmiştir</p>
                                <div className="blog__details-area-contact-form">
                                    <FormArea />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4 columns_sticky">
                        <BlogSidebar />
                    </div>
                </div>
            </div>
        </div>    
        </>
    );
};

export default BlogSingleMain;