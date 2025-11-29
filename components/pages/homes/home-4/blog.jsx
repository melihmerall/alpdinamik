import React from 'react';
import Link from "next/link";
import blogData from '../../../data/blog-data';

const BlogFour = () => {
    return (
        <>
            <div className="blog__four section-padding-two">
                <div className="container">
                    <div className="row mb-30">
                        <div className="col-xl-12">
                            <div className="blog__four-title t-center">
                                <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">News & Blog</span>
                                <h2 className="wow fadeInRight" data-wow-delay=".6s">Update News & Blogs</h2>
                            </div>					
                        </div>
                    </div>
                    <div className="row">
                        {blogData?.slice(0, 3)?.map((data, id) => (
                            <div className="col-xl-4 col-md-6 mt-25 wow fadeInUp" data-wow-delay={`${data.delay}s`} key={id}>
                                <div className="blog__four-item">
                                    <div className="blog__four-item-image">
                                        <Link href={`/blog/${data.id}`}><img src={data.image.src} alt="blog" /></Link>
                                        <div className="blog__four-item-image-date">
                                            <h5>{data.date}</h5>
                                            <h6>Dec</h6>
                                        </div>
                                    </div>
                                    <div className="blog__four-item-content">
                                        <div className="meta">
                                            <ul>
                                                <li><a href="#"><i className="far fa-user"></i>By-Admin</a></li>
                                                <li><a href="#"><i className="far fa-comment-dots"></i>Comments ({data.comment})</a></li>
                                            </ul>
                                        </div>
                                        <h4><Link href={`/blog/${data.id}`}>{data.title}</Link></h4>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>        
        </>
    );
};

export default BlogFour;