import React from 'react';

const MissionVisionMain = ({ missionVisionData }) => {
    // Use admin data if available, otherwise use default content
    const missionSubtitle = missionVisionData?.missionSubtitle || "Misyonumuz";
    const missionTitle = missionVisionData?.missionTitle || "Doğru Ürün + Doğru Mühendislik + Sürdürülebilir Hizmet";
    const missionBody = missionVisionData?.missionBody || "Alp Dinamik olarak, lineer hareket sistemleri alanında müşterilerimize en doğru ürünü, en uygun mühendislik çözümü ile sunmayı ve bu hizmeti sürdürülebilir bir şekilde devam ettirmeyi misyon edinmiş bulunmaktayız. Projeci yaklaşımımız ve mühendislik odaklı hizmet anlayışımızla, endüstriyel uygulamalarda güvenilir çözüm ortağı olmayı hedefliyoruz.";
    const missionImageUrl = missionVisionData?.missionImageUrl || '/assets/img/about/about-4.jpg';

    const visionSubtitle = missionVisionData?.visionSubtitle || "Vizyonumuz";
    const visionTitle = missionVisionData?.visionTitle || "Lineer Hareket Sistemlerinde Lider Çözüm Ortağı";
    const visionBody = missionVisionData?.visionBody || "Alp Dinamik, lineer hareket sistemleri alanında Türkiye'nin önde gelen mühendislik ve proje çözüm ortağı olmayı hedeflemektedir. Teknolojik gelişmeleri yakından takip ederek, müşterilerimize en güncel ve verimli çözümleri sunmak, sektörde referans firma konumuna gelmek vizyonumuzdur.";
    const visionImageUrl = missionVisionData?.visionImageUrl || '/assets/img/about/about-4.jpg';

    return (
        <>
            {/* Mission Section */}
            <div className="mission__area section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 lg-mb-25">
                            <div className="mission__area-left mr-40 xl-mr-0">
                                <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">{missionSubtitle}</span>
                                <h2 className="title_split_anim">{missionTitle}</h2>
                                <div className="mission__area-left-content mt-30">
                                    <p>{missionBody}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="mission__area-right">
                                <div className="mission__area-right-image wow img_right_animation">
                                    <img src={missionImageUrl} alt="Misyon" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vision Section */}
            <div className="about__five section-padding pt-0">
                <div className="container">
                    <div className="row al-center">
                        <div className="col-lg-5 lg-mb-25">
                            <div className="about__five-image wow img_left_animation">
                                <img src={visionImageUrl} alt="Vizyon" />
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <div className="about__five-right ml-70 xl-ml-0">
                                <div className="about__five-right-title">
                                    <span className="subtitle wow fadeInLeft" data-wow-delay=".4s">{visionSubtitle}</span>
                                    <h2 className="title_split_anim">{visionTitle}</h2>
                                </div>
                                <div className="about__five-right-content mt-30">
                                    <p>{visionBody}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MissionVisionMain;

