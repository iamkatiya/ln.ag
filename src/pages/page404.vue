<template>
  <div class="not-found">
    <div class="not-found__container logo">
      <div class="logo__container">
        <h1 class="logo__container_title">
          404
        </h1>
        <div class="logo__container_description">
          {{ langPack[lang]['errorText'] }}
        </div>
      </div>
    </div>
    <div class="copyright">
      <span class="copyright__icon">&copy;</span>
      <a
        class="copyright__logo"
        href="https://www.bmc.ai/"
        target="_blank"
      >
        <img src="../assets/images/bmc-logo.png">
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page404',
  data () {
    return {
      lang: navigator.language==='ru-RU'?'ru':'en',
      langPack: {
        "ru":{"errorText":"Данная ссылка не найдена или истек ее срок действия"},
        "en":{"errorText":"This link was not found or expired"}
      },
    }
  }
}
</script>

<style lang="scss">
  @import url("../assets/scss/fonts.scss");
  @import url("../assets/scss/main.scss");

  .not-found {
    background: linear-gradient(to left bottom,rgb(240, 75, 101), rgb(6, 36, 75));
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    overflow: hidden;
    text-align: center;
    padding: 1rem 1rem 0;

    &__container {
      min-height: 85vh;
    }
  }

  h1 {
    font-family: "oleo", sans-serif;
    text-shadow: -2px -2px 0 rgba(154, 154, 154, 0.7);
    color: #f3f3f3;
    font-size: 180px;
    font-weight: 100;
    margin: 0;
    transition: 0.5s;

    @media (max-width: 660px) {
      font-size: 120px;
    }
  }

  .logo {
    flex: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    &__container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      &_description {
        color: white;
        flex: 100%;
      }
    }
  }

  .copyright {
    text-transform: uppercase;
    bottom: 40px;
    width: 100%;
    padding: 1rem;
    right: 1rem;
    text-align: right;
    color: white;
    font-size: 14px;
    display: flex;
    justify-content: flex-end;
    max-height: 20px;
    max-width: 1080px;

    img {
      height: auto;
      max-width: 40px;
    }

    &__logo {
      margin-right: 0.5rem;
    }

    &__icon {
      padding-right: 0.2rem;
    }
  }
</style>
