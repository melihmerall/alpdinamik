
import blogData from '@/components/data/blog-data';
import Link from 'next/link';

const BlogSidebar = () => {
    return (
        <div className="all__sidebar">
            <div className="all__sidebar-item">
                <h4>Search Here</h4>
                <div className="all__sidebar-item-search">
                    <form action="#">
                        <input type="text" placeholder="Search....." />
                        <button type="submit"><i className="fal fa-search"></i></button>
                    </form>
                </div>
            </div>
            <div className="all__sidebar-item">
                <h4>Recent Blog</h4>
                <div className="all__sidebar-item-post">
                    {blogData?.slice(0, 3)?.map((data, id) => (
                        <div className="post__item" key={id}>
                            <div className="post__item-image">
                                <Link href={`/blog/${data.id}`}><img src={data.image.src} alt="image" /></Link>
                            </div>
                            <div className="post__item-title">
                                <span><i className="far fa-calendar-alt"></i>Mar {data.date}, 2025</span>
                                <h6><Link href={`/blog/${data.id}`}>{data.title}</Link></h6>
                            </div>
                        </div>
                    ))}                        
                </div>
            </div>
            <div className="all__sidebar-item">
                <h4>Popular Tag</h4>
                <div className="all__sidebar-item-tag">
                    <ul>
                        <li><Link href="/blog">Innovation</Link></li>
                        <li><Link href="/blog">Insights</Link></li>
                        <li><Link href="/blog">Resources</Link></li>
                        <li><Link href="/blog">Tips</Link></li>
                        <li><Link href="/blog">Trends</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BlogSidebar;