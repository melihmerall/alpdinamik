"use client"
import { useParams, useRouter } from "next/navigation";
import ServicesSingle from '@/components/pages/services/service-single';
import servicesData from '@/components/data/services-data';

const ServicesDetail = () => {
    const params = useParams();
    const singleData = servicesData?.find((service) => service.id === params.id);
    const router = useRouter();
    if (!singleData) {
        return router.push("/404-error");
    }
    return (
        <>
            <ServicesSingle singleData={singleData} />
        </>
    );
};

export default ServicesDetail;