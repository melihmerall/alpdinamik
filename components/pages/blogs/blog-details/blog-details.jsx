import BlogSidebar from '../blog-sidebar/blog-sidebar';

const BlogSingleMain = ({singleData}) => {

    return (
        <>
        <div className="blog__details section-padding">
            <div className="container">
                <div className="row">
                    <div className="col-lg-8 lg-mb-25">
                        <div className="blog__details-area">
                            <img 
                                src={singleData.image.src} 
                                alt={singleData.title}
                                style={{
                                    width: '100%',
                                    maxWidth: '800px',
                                    height: 'auto',
                                    maxHeight: '450px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    marginBottom: '2rem'
                                }}
                            />
                            <h3 className="mt-25 mb-20" style={{ color: 'var(--text-heading-color)' }}>
                                {singleData.title}
                            </h3>
                            {singleData.date && (
                                <div style={{ marginBottom: '1.5rem', color: 'var(--body-color)', fontSize: '0.95rem' }}>
                                    <i className="far fa-calendar-alt" style={{ marginRight: '0.5rem' }}></i>
                                    {singleData.date}
                                </div>
                            )}
                            {singleData.body && (
                                <div 
                                    className="blog__details-content"
                                    style={{ 
                                        color: 'var(--body-color)',
                                        lineHeight: '1.8',
                                        fontSize: '1.05rem'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: singleData.body }}
                                />
                            )}
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