import React, { useState } from 'react';
import BlogSidebar from '../blog-sidebar/blog-sidebar';
import Pagination from '../blog/pagination';
import blogData from '../../../data/blog-data';
import Link from 'next/link';


const BlogStandardMain = ({position}) => {
    const blogItemShow = 3;
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = Math.ceil(blogData.length / blogItemShow);
    const startIndex = currentPage * blogItemShow;
    const endIndex = startIndex + blogItemShow;
    const currentBlogItems = blogData.slice(startIndex, endIndex);
    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
        setCurrentPage(currentPage + 1);
        }
    };
    const handlePrevPage = () => {
        if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
        }
    };
    return (
        <div className="blog__standard section-padding">
            <div className="container">
                <div className="row">
                    <div className="col-lg-4 columns_sticky lg-mb-25">
                        <BlogSidebar />
                    </div>
                    <div className="col-lg-8">
                        <div className="blog__standard-left">
                            {currentBlogItems?.map((data, id) => (
                                <div className="blog__standard-item" key={id}>
                                    <div className="blog__standard-item-image">
                                        <Link href={`/blog/${data.id}`}><img src={data.image.src} alt="image" /></Link>
                                    </div>
                                    <div className="blog__standard-item-content">
                                        <div className="blog__standard-item-content-meta">
                                            <ul>
                                                <li><Link href="#"><i className="fal fa-user"></i>Admin</Link></li>
                                                <li><Link href="#"><i className="fal fa-calendar-alt"></i>{data.date}, March 2025</Link></li>
                                            </ul>
                                        </div>
                                        <h3><Link href={`/blog/${data.id}`}>{data.title}</Link></h3>
                                        <p>{data.description}</p>
                                        <Link className="build_button" href={`/blog/${data.id}`}>Read More<i className="flaticon-right-up"></i></Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            handlePrevPage={handlePrevPage}
                            totalPages={totalPages}
                            handleNextPage={handleNextPage}
                            setCurrentPage={setCurrentPage}
                            position={position || "left"}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogStandardMain;