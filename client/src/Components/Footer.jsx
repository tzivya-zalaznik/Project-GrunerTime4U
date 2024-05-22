import React from 'react';

export default function Footer() {
  return (
    <footer class="text-center text-lg-start bg-body-tertiary text-muted" style={{bottom: '0px',position: 'unset',width: '100%'}}>
      <section class="">
        <div class="container text-center text-md-start mt-5">
          <div class="row mt-3">
            <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
              <h6 class="text-uppercase fw-bold mb-4">
                שעות פתיחה
              </h6>
              <p>ימים : א-ה </p>
              <p>בין השעות : 21:00-23:00 </p>
              <p>או בתאום מראש </p>
            </div>
            <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
              <h6 class="text-uppercase fw-bold mb-4">פרטים</h6>
              <p>בית שמש, רחוב אביי 11 <i class="fas fa-home me-3 pi pi-map-marker"></i></p>
              <p> 02-5860374 <i class="fas fa-phone me-3  pi pi-phone"></i></p>
              <p> 7644255g@gmail.com <i class="fas fa-envelope me-3 pi pi-at"></i></p>
            </div>
            
            <div class="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
              <h6 class="text-uppercase fw-bold mb-4">
                <i class="fas fa-gem me-3"></i>אודתינו
              </h6>
              <p>
            גרונר דואגים לכם לחווית קניה בטוחה ואמינה שלא נגמרת עם קנית השעון. גרונר לוקחים אחריות, ומוכרים רק שעוני מותג מקוריים ואיכותיים מתאימים לכם שעון שמותאם במדויק עבורכם ומלווים אתכם בשרות חם מכל הלב לאורך זמן גרונר כאן בשבילכם-נותנים לכם בית לשעון.
          </p>
            </div>
            <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
              <h6 class="text-uppercase fw-bold mb-4">
                ניווט מהיר
              </h6>
              <p>
                <a href="/" class="text-reset">דף הבית</a>
              </p>
              <p>
                <a href="gallery" class="text-reset">גלריה</a>
              </p>
              <p>
                <a href="favorite" class="text-reset">מועדפים</a>
              </p>
              <p>
                <a href="login" class="text-reset">כניסה</a>
              </p>
              <p>
                <a href="register" class="text-reset">הרשמה</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <div class="text-center p-4" style={{ backgroundcolor: 'rgba(0, 0, 0, 0.05)' }}>
        ©&nbsp;
        <a class="text-reset fw-bold" href="/">GrunerTime4U.com</a>&nbsp;
        גרונר. בית לשעוני מותג

      </div> */}
      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2024 גרונר. בית לשעוני מותג 
        <a className='text-reset fw-bold' href='/'>
        &nbsp;GrunerTime4U.com 
        </a>
        {/* <img src='download.png'></img> */}
      </div>
    </footer>
  );
}