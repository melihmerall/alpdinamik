import image1 from "../../public/assets/img/service/services-1.jpg";
import image2 from "../../public/assets/img/service/services-2.jpg";
import image3 from "../../public/assets/img/service/services-3.jpg";
import image4 from "../../public/assets/img/service/services-4.jpg";
import image5 from "../../public/assets/img/service/services-5.jpg";
import image6 from "../../public/assets/img/service/services-6.jpg";

const servicesData = [
    {
        id: 'proje-tasarimi-muhendislik',
        icon: <i className="flaticon-project"></i>,
        title: 'Proje Tasarımı & Mühendislik',
        description: 'Uygulamanızın yük, strok, hız ve çalışma çevrimi gibi parametrelerini analiz ederek en doğru lineer hareket çözümünü tasarlıyoruz. Proje bazlı mühendislik danışmanlığı ile güvenli ve verimli sistemler kuruyoruz.',
        number: '1',
        image: image1,
    },
    {
        id: 'urun-secimi-boyutlandirma',
        icon: <i className="flaticon-design-thinking"></i>,
        title: 'Ürün Seçimi & Boyutlandırma',
        description: 'Temsil ettiğimiz markaların ürün portföyünden, uygulamanıza en uygun vidalı kriko, yön değiştirici veya lineer aktüatörü seçiyor ve teknik boyutlandırmasını yapıyoruz.',
        number: '2',
        image: image2,
    },
    {
        id: 'cad-teknik-veri',
        icon: <i className="flaticon-data"></i>,
        title: '2D / 3D CAD & Teknik Veri Desteği',
        description: 'Projelerinizi hızlandırmak için 2D ve 3D CAD verileri, teknik çizimler ve ürün katalogları sağlıyoruz. Mekanik entegrasyon süreçlerinizi destekliyoruz.',
        number: '3',
        image: image3,
    },
    {
        id: 'devreye-alma-satis-sonrasi',
        icon: <i className="flaticon-wrench-1"></i>,
        title: 'Devreye Alma & Satış Sonrası',
        description: 'Sistemlerinizin saha kurulumu, devreye alma ve test süreçlerinde teknik destek sunuyoruz. Satış sonrası bakım ve yedek parça hizmetleriyle yanınızdayız.',
        number: '4',
        image: image4,
    },
];

export default servicesData;