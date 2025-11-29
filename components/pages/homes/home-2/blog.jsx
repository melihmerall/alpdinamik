import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation} from 'swiper/modules';
import blogData from '../../../data/blog-data';

const BlogTwo = () => {
    const blogItem = blogData.slice(0, 4);
    const slideControl = {
        spaceBetween: 25,
        speed: 1000,
        loop: true,
        slidesPerView: 3,
        autoplay: {
            delay: 4000,
            reverseDirection: false,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.blog_next',
            prevEl: '.blog_prev',
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            768: {
                slidesPerView: 2,
            },
            1200: {
                slidesPerView: 3,
            },
        },
    };
    return (
        <div className="blog__two section-padding-two">
            <div className="container">
                <div className="row mb-55">
                    <div className="col-xl-12">
                        <div className="blog__two-title t-center">
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">News & Blog</span>
                            <h2 className="wow fadeInRight" data-wow-delay=".6s">Update News & Blogs</h2>
                        </div>					
                    </div>
                </div>
                <div className="row wow fadeInUp" data-wow-delay=".5s">
                    <div className="col-xl-12">
                        <div className="slider-area">
                            <Swiper modules={[EffectFade, Autoplay, Navigation]} {...slideControl} >
                                {blogItem?.map((data, id) => (
                                    <SwiperSlide key={id}>
                                        <div className="blog__one-item">
                                            <div className="blog__one-item-image">
                                            <Link href={`/blog/${data.id}`}><img src={data.image.src} alt="blog" /></Link>
                                                <div className="blog__one-item-image-date">
                                                    <h6><i className="fa-regular fa-calendar"></i>{data.date} Dec</h6>
                                                </div>
                                            </div>
                                            <div className="blog__one-item-content">
                                                <div className="meta">
                                                    <ul>
                                                        <li><a href="#"><i className="far fa-user"></i>By-Admin</a></li>
                                                        <li><a href="#"><i className="far fa-comment-dots"></i>Comments ({data.comment})</a></li>
                                                    </ul>
                                                </div>
                                                <h4><Link href={`/blog/${data.id}`}>{data.title}</Link></h4>
                                                <Link className="more_btn" href={`/blog/${data.id}`}>Read More<i className="flaticon-right-up"></i></Link>
                                            </div>
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <div className="slider-arrow">
                                <div className="slider-arrow-prev blog_prev">
                                    <i className="fa-sharp fa-regular fa-arrow-left-long"></i>
                                </div>
                                <div className="slider-arrow-next blog_next">
                                    <i className="fa-sharp fa-regular fa-arrow-right-long"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogTwo;