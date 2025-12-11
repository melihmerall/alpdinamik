import Link from 'next/link';
import React from 'react';

const BlogItem = ({currentBlogItems}) => {
    return (
        <>
            {currentBlogItems?.map((data, id) => (
				<div className="col-lg-6 mt-25" key={id}>
					<div className="blog__three-item mt-25">
                        <div className="blog__three-item-image">
							<Link href={`/blog/${data.id}`}><img src={data.image.src} alt="image" /></Link>						
                        </div>
                        <div className="blog__three-item-content">
                            <div className="meta">
                                <ul>
									<li><Link href="#"><i className="far fa-user"></i>By-Admin</Link></li>
									<li><Link href="#"><i className="far fa-comment-dots"></i>Comments ({data.comment})</Link></li>
                                </ul>
                            </div>
							<h4><Link href={`/blog/${data.id}`}>{data.title}</Link></h4>
							<Link className="more_btn" href={`/blog/${data.id}`}>Read More<i className="flaticon-right-up"></i></Link>
                        </div>
                    </div>
				</div>
            ))}            
        </>
    );
};

export default BlogItem;