import React from 'react';
import Link from "next/link";
import blogData from '../../../data/blog-data';

const Blog = () => {
    return (
        <>
            <div className="blog__three section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-4 col-lg-5 columns_sticky lg-mb-30">
                            <div className="title">
                                <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">Latest Insights</span>
                                <h2 className="title_split_anim mb-20">Stay Updated on Industry Trends</h2>
                                <p className="wow fadeInUp" data-wow-delay=".4s">Subscribe to our newsletter for the latest insights and developments shaping the construction</p>
                                <div className="wow fadeInDown" data-wow-delay="1.2s">
                                    <a className="build_button mt-25" href="blog.html">View Blog<i className="flaticon-right-up"></i></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-8 col-lg-7">
                            <div className="blog__three-right">
                                {blogData?.slice(0, 4)?.map((data, id) => (
                                    <div className="blog__three-item card_sticky" key={id}>
                                        <div className="blog__three-item-image">
                                            <Link href={`/blog/${data.id}`}><img src={data.image.src} alt="blog" /></Link>
                                        </div>
                                        <div className="blog__three-item-content">
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
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>          
        </>
    );
};

export default Blog;