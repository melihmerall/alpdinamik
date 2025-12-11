import Link from "next/link";
import blogData from '../../../data/blog-data';

const Blog = () => {
    const blogItem = blogData.slice(0, 3);
    return (
        <div className="blog__one section-padding-two pt-0">
            <div className="container">
                <div className="row mb-55">
                    <div className="col-xl-12">
                        <div className="blog__one-title t-center">
                            <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">News & Blog</span>
                            <h2 className="wow fadeInRight" data-wow-delay=".6s">Update News & Blogs</h2>
                        </div>					
                    </div>
                </div>
                <div className="row">
                    {blogItem?.map((data, id) => (
                        <div className="col-xl-4 col-lg-6 wow fadeInUp" data-wow-delay={`${data.delay}s`} key={id}>
                            <div className="blog__one-item">
                                <div className="blog__one-item-image">
                                    <Link href={`/blog/${data.id}`}><img src={data.image.src} alt="blog" /></Link>
                                    <div className="blog__one-item-image-date">
                                        <h6><i className="fa-regular fa-calendar"></i>22 Dec</h6>
                                    </div>
                                </div>
                                <div className="blog__one-item-content">
                                    <h4><Link href={`/blog/${data.id}`}>{data.title}</Link></h4>
                                    <Link className="more_btn" href={`/blog/${data.id}`}>Read More<i className="flaticon-right-up"></i></Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blog;