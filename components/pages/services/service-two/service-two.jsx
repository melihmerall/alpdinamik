import Link from 'next/link';
import servicesData from '@/components/data/services-data';

const ServicesMain = () => {
    return (
        <>
	    <div className="services__four section-padding">
                <div className="container">
                    <div className="row gy-4">
                        {servicesData?.map((data, id) => {
							const words = data.title.split(' ');
							const firstAndSecondWord = words.slice(0, 2).join(' ');
                            return (
                                <div className="col-xl-4 col-lg-4 col-md-6" key={id}>
                                    <div className="services__four-single-service">
                                        <div className="services__four-single-service-icon">
                                            {data.icon} 
                                        </div>
                                        <div className="services__four-single-service-content">
                                            <h4>{firstAndSecondWord}</h4>
                                            <p>{data.des}</p>
                                            <Link href={`/services/${data.id}`} className="btn-three">Read More<i className="fas fa-chevron-right"></i></Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ServicesMain;