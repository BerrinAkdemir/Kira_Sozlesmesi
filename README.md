📌 Proje Hakkında
Bu proje, geleneksel kira sözleşmelerinin dijital ortama taşınmasını ve işlemlerin güvenli, şeffaf ve otomatik şekilde gerçekleştirilmesini amaçlamaktadır. Ethereum blockchain ağı üzerinde çalışan bir akıllı kira sözleşmesi geliştirildi ve web arayüzü ile kullanıcı etkileşimi sağlandı.

🎯 Projenin Amacı
Ev sahibi ve kiracı arasındaki kira anlaşmalarını blockchain üzerinde kalıcı olarak kayıt altına almak.
ETH cinsinden otomatik kira ödemelerini gerçekleştirmek.
Kayıtların değiştirilemez, güvenli ve herkes tarafından sorgulanabilir olmasını sağlamak.

🛠️ Kullanılan Teknolojiler
Kategori	Kullanılan Teknolojiler ve Araçlar
Frontend	HTML5, CSS3, JavaScript
Blockchain	Ethereum (Sepolia Testnet), Solidity
Kütüphaneler	Ethers.js, Font Awesome
Geliştirme Ortamları	Remix IDE, Ganache, Visual Studio Code
Cüzdan Entegrasyonu	MetaMask
Test ve Takip	Sepolia Testnet, Etherscan

⚙️ Akıllı Sözleşme Özellikleri
Ödeme Kaydı: Her ödeme kiracı adresi, ödeme miktarı ve tarih bilgisi ile kaydedilir.
Otomatik Transfer: ETH, doğrudan ev sahibinin cüzdanına aktarılır.
Şeffaflık: getAllKiraKayitlari fonksiyonu ile tüm ödeme geçmişi görüntülenebilir.
Değiştirilemezlik: Tüm veriler blockchain'e kalıcı olarak kaydedilir.

🔄 Akış Diyagramı
Kullanıcı web arayüzünü açar.
MetaMask cüzdanı bağlanır.
Ağ kontrolü yapılır (Sepolia).
Son ödeme bilgisi ve tüm ödeme geçmişi alınır.
ETH gönderimi yapılır.
Başarılı işlem sonrası kayıt güncellenir.
