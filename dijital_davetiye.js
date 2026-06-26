// Düğün tarihini buraya giriyoruz (Yıl, Ay-1, Gün, Saat, Dakika)
const weddingDate = new Date(2026, 8, 25, 19, 0, 0).getTime();

const timer = setInterval(function () {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").innerText = days < 10 ? "0" + days : days;
  document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
  document.getElementById("minutes").innerText =
    minutes < 10 ? "0" + minutes : minutes;
  document.getElementById("seconds").innerText =
    seconds < 10 ? "0" + seconds : seconds;

  if (distance < 0) {
    clearInterval(timer);
    document.getElementById("countdown").innerHTML =
      "<h3>Büyük Gün Geldi!</h3>";
  }
}, 1000);

// --- ÜST ÜSTE DAĞINIK FOTOĞRAF YIĞINI TIKLAMA MANTIĞI ---
window.addEventListener("DOMContentLoaded", () => {
  const photoStack = document.getElementById("photoStack");

  if (photoStack) {
    photoStack.addEventListener("click", function (event) {
      const clickedItem = event.target.closest(".photo-item");

      if (!clickedItem) return;
      if (
        clickedItem.classList.contains("is-flying") ||
        clickedItem.classList.contains("is-hidden")
      )
        return;
      if (clickedItem !== photoStack.lastElementChild) return;

      clickedItem.classList.add("is-flying");

      setTimeout(() => {
        clickedItem.classList.remove("is-flying");
        clickedItem.classList.add("is-hidden");
        photoStack.prepend(clickedItem);

        setTimeout(() => {
          clickedItem.classList.remove("is-hidden");
        }, 30);
      }, 400);
    });
  }

  // --- LCV WHATSAPP ENTEGRASYON MANTIĞI (YENİ SÜRÜM) ---
  const rsvpForm = document.getElementById("rsvpForm");
  const rsvpFormContainer = document.getElementById("rsvpFormContainer");
  const formMessage = document.getElementById("formMessage");

  // Başında ülke kodu (90) olmalı, artı (+) işareti veya boşluk olmamalıdır.
  const myPhoneNumber = "905077070554";

  // KONTROL: Bu telefon daha önce bilgi göndermiş mi?
  if (localStorage.getItem("rsvpSubmitted") === "true") {
    if (rsvpFormContainer) rsvpFormContainer.style.display = "none";
    formMessage.className = "form-message success";
    formMessage.style.marginTop = "30px";
    formMessage.innerHTML = `<h3>Katılım Bilginiz Alınmıştır</h3><p>Bu cihazdan daha önce bildirim yapılmıştır. Teşekkür ederiz! ❤️</p>`;
  }

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", (e) => {
      e.preventDefault(); // EKRANIN EN BAŞA DÖNMESİNİ ENGELLER

      const name = document.getElementById("guestName").value;
      const attendance = document.querySelector(
        'input[name="attendance"]:checked',
      ).value;

      // WhatsApp mesaj metnini hazırlama
      let statusText =
        attendance === "katiliyorum"
          ? "Evet, Katılacağım ✨"
          : "Hayır, Katılamayacağım ❤️";
      let whatsappMessage = `Merhaba, ben *${name}*.\nDijital davetiyeniz üzerinden katılım durumumu bildirmek istedim.\n\n*Katılım Durumu:* ${statusText}`;

      // Linki güvenli hale getirme (boşlukları ve özel karakterleri tarayıcı diline çevirir)
      let encodedMessage = encodeURIComponent(whatsappMessage);

      // WhatsApp yönlendirme linki
      let whatsappUrl = `https://api.whatsapp.com/send?phone=${myPhoneNumber}&text=${encodedMessage}`;

      // Telefon hafızasına kilidi at (Tekrar dolduramasın)
      localStorage.setItem("rsvpSubmitted", "true");

      // Form kutusunu pürüzsüzce gizle
      rsvpFormContainer.style.display = "none";

      // KALICI BİLGİLENDİRME MESAJI (Ekran yukarı fırlamaz, form yerinde kalır)
      formMessage.className = "form-message success";
      formMessage.style.marginTop = "30px";

      if (attendance === "katiliyorum") {
        formMessage.innerHTML = `<h3>Teşekkürler ✨</h3><p>Sayın <strong>${name}</strong>, katılım durumunuz (Evet, Katılacağım) başarıyla kaydedildi ve WhatsApp'a yönlendiriliyorsunuz...</p>`;
      } else {
        formMessage.innerHTML = `<h3>Geri Bildiriminiz Alındı ❤️</h3><p>Sayın <strong>${name}</strong>, katılamama durumunuz kaydedildi ve WhatsApp'a yönlendiriliyorsunuz...</p>`;
      }

      // 1 saniye sonra misafiri otomatik olarak WhatsApp'a uçurur
      setTimeout(() => {
        window.open(whatsappUrl, "_blank");
      }, 1000);
    });
  }
});
