<template>
  <div class="content">
    <div class="content__container">
      <div class="content__lang">
        <div
          class="language"
          :class="{active : lang==='ru'}"
          @click="lang='ru'"
        >
          RU
        </div>
        <div
          class="language"
          :class="{active : lang==='en'}"
          @click="lang='en'"
        >
          EN
        </div>
      </div>
      <div class="content__group">
        <div class="content__head logo">
          <h1 class="logo__title">
            ln.ag
          </h1>
          <div class="logo__description">
            {{ langPack[lang]['description'] }}
          </div>
        </div>
        <div class="search-url">
          <div class="search-url__block">
            <input
              v-model="inputUrl"
              class="main-input"
              :placeholder="langPack[lang]['insertLink']"
              @keyup="onChangeInput"
            >
            <div
              v-if="clearInput"
              class="clear-icon"
              @click="inputClear"
            />
            <button
              v-if="waitAnswer"
              class="main-btn main-btn__disabled"
            >
              {{ langPack[lang]['getLink'] }}
            </button>
            <button
              v-else
              class="main-btn"
              @click="sendUrl"
            >
              {{ langPack[lang]['getLink'] }}
            </button>
          </div>
          <div
            v-if="emptyUrl"
            class="search-url__error"
          >
            {{ langPack[lang]['emptyLink'] }}
          </div>
          <div
            v-if="noUrl"
            class="search-url__error"
          >
            {{ langPack[lang]['incorrectLink'] }}
          </div>
        </div>
        <div class="content__results">
          <div
            v-for="(url, index) in (arrUrl.slice().reverse()).slice(0, 5)"
            :key="url.id"
            class="result"
          >
            <div class="result__item">
              <div class="result__long-link">
                <span>{{ url.old }}</span>
              </div>
              <div class="result__short-link">
                <a
                  :href="url.new"
                  target="_blank"
                >{{ url.new }}</a>
              </div>
              <div class="result__copy">
                <button
                  class="qr-btn"
                  @click="showModalWindow(url.new)"
                  @keydown.esc="showModal = false"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4,4H10V10H4V4M20,4V10H14V4H20M14,15H16V13H14V11H16V13H18V11H20V13H18V15H20V18H18V20H16V18H13V20H11V16H14V15M16,15V18H18V15H16M4,20V14H10V20H4M6,6V8H8V6H6M16,6V8H18V6H16M6,16V18H8V16H6M4,11H6V13H4V11M9,11H13V15H11V13H9V11M11,6H13V10H11V6M2,2V6H0V2A2,2 0 0,1 2,0H6V2H2M22,0A2,2 0 0,1 24,2V6H22V2H18V0H22M2,18V22H6V24H2A2,2 0 0,1 0,22V18H2M22,22V18H24V22A2,2 0 0,1 22,24H18V22H22Z" />
                  </svg>
                </button>
                <button
                  v-if="isActive===index"
                  class="copy-btn copy-btn_success"
                >
                  {{ langPack[lang]['copied'] }}
                </button>
                <button
                  v-else
                  class="copy-btn"
                  :class="isActive===index?'copied':''"
                  @click="getShortUrl(url.new, index)"
                >
                  {{ langPack[lang]['copy'] }}
                </button>
              </div>
            </div>
          </div>
          <button
            v-if="clearBtn"
            class="clear-btn"
            @click="clearStorage"
          >
            {{ langPack[lang]['clear'] }}
          </button>
        </div>
      </div>
      <div
        class="copyright"
      >
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
    <transition name="fade">
      <div
        v-show="showModal"
        class="modal"
        @click="showModal = false"
      >
        <div class="modal__content">
          <span class="modal__qr">
            QR: {{ modalUrl }}
          </span>
          <qrcode-vue
            :value="modalUrl"
            :size="size"
            level="H"
          />
          <span class="modal__description">
            {{ langPack[lang]['qrDescription'] }}
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import webservice from '@/api'
  import QrcodeVue from 'qrcode.vue'

  export default {
    name: 'Main',
    components: {
      QrcodeVue
    },
    data () {
      return {
        arrUrl: [],
        inputUrl: '',
        copyText: '',
        modalUrl: '',
        lang: navigator.language==='ru-RU'?'ru':'en',
        langPack: {
          "ru":{"copy":"Скопировать","description":"Быстрый и удобный способ создания короткой ссылки", "insertLink": "Вставьте ссылку", "getLink": "Сократить", "emptyLink": "Вы не вставили ссылку", "incorrectLink": "Укажите корректный URL", "copied":"Скопировано!", "qrDescription": "Чтобы отсканировать код поднесите камеру телефона к экрану", "clear" : "Очистить"},
          "en":{"copy":"Copy","description":"It's an easy and convenient way to create a short link", "insertLink": "Insert your link", "getLink": "Shorten", "emptyLink": "You did not insert a link", "incorrectLink": "Please enter a valid URL",  "copied":"Copied!", "qrDescription": "To scan the code, hold the phone camera to the screen", "clear" : "Clear"}
        },
        urlReg: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/, //eslint-disable-line
        size: 200,
        emptyUrl: false,
        noUrl: false,
        showModal: false,
        isActive: false,
        waitAnswer: false,
        clearBtn: false,
        clearInput: false
      }
    },
    mounted () {
      if (localStorage.getItem('storeUrl')) {
        this.arrUrl = JSON.parse(localStorage.getItem('storeUrl'))
      }

      if(this.arrUrl.length !== 0) {
        this.clearBtn = true
      }
    },
    methods: {
      sendUrl () {
        this.waitAnswer = true
        if ((this.inputUrl) && (this.validUrl(this.inputUrl))) {
          this.emptyUrl = false
          this.noUrl = false
          webservice.getGlobalLink(this.inputUrl)
            .then(({ data }) => {
              this.arrUrl.push({ old: this.inputUrl, new: 'https://' + data.link })
              localStorage.storeUrl = JSON.stringify(this.arrUrl)
              this.waitAnswer = false
            })
          this.clearBtn = true
          this.clearInput = false
        } else if (!this.inputUrl) {
          this.noUrl = false
          this.emptyUrl = true
          this.waitAnswer = false
        } else {
          this.emptyUrl = false
          this.noUrl = true
          this.waitAnswer = false
          this.clearInput = false
        }
        setTimeout(() => {
          this.inputUrl = ''
        }, 500)
      },

      getShortUrl (url,i) {
        this.isActive = i
        setTimeout(() => {
          this.isActive = false
        }, 1200)
        navigator.clipboard.writeText(url).then(function () {
        })
      },

      validUrl (url) {
        if (this.urlReg.test(url)) {
          return true
        }
      },

      showModalWindow (url) {
        this.showModal = true
        this.modalUrl = url
      },

      clearStorage () {
        this.arrUrl = []
        localStorage.storeUrl = []
        this.clearBtn = false
        this.emptyUrl = false
        this.noUrl = false
      },

      onChangeInput () {
        this.clearInput = true
      },

      inputClear () {
        this.inputUrl = ''
        this.clearInput = false
      }
    }
  }
</script>

<style lang="scss">
  @import "~@/assets/scss/main.scss";
  @import "~@/assets/scss/fonts.scss";
  .content {
    background: linear-gradient(to left bottom,rgb(240, 75, 101), rgb(6, 36, 75));
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    background-size: cover;
    min-height: 100vh;
    position: relative;
    overflow: hidden;

    &__group {
      width: 100%;
      position: relative;
    }

    &__lang {
      margin-top: 30px;
      width: 100%;
      display: flex;
      justify-content: flex-end;
      color: white;
      align-self: flex-start;

      .language {
        margin-left: 0.5rem;
        opacity: .7;
        cursor: pointer;
      }

      .active {
        opacity: 1;
        font-weight: bold;
      }
    }

    &__container {
      text-align: center;
      max-width: 1080px;
      width: 100%;
      min-height: 100vh;
      transition: 0.3s;
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;

      @media (max-width: 1200px) {
        max-width: 700px;
      }

      @media (max-width: 750px) {
        max-width: 400px;
      }

      @media (max-width: 500px) {
        max-width: none;
        width: 100%;
        padding: 0 1rem;
      }

      @media (max-height: 850px) {
        margin-top: 0;
      }
    }


    &__results {
      border: none;
      margin-top: 1rem;

      @media (max-width: 768px) {
        box-shadow: none;
      }
    }

    &__head {
      margin-bottom: 3rem;
    }
  }

  .logo {
    &__description {
      color: white;
    }
  }

  h1 {
    font-family: "oleo", sans-serif;
    text-shadow: -2px -2px 0 rgba(154, 154, 154, 0.7);
    color: #f3f3f3;
    font-size: 180px;
    font-weight: 100;
    transition: 0.3s;
    position: relative;

    @media (max-width: 500px) {
      font-size: 120px;
      width: 300px;
      margin: auto;
    }
  }

  .main-input {
    background: white;
    font-size: 16px;
    box-sizing: border-box;
    transition: 0.3s;
    width: calc(100% - 215px);
    margin-right: 30px;
    border: 1px solid transparent;

    &:focus {
      outline: transparent;
      box-shadow: 0 0 5px #fff;
    }

    @media (max-width: 760px) {
      width: 100%;
      box-shadow: none;
    }
  }

  .search-url {
    &__error {
      border-radius: 0.3rem;
      border: none;
      box-shadow: 0 3px 9px 0 rgba(0, 0, 0, 0.1);
      padding: 0.8rem;
      margin-top: 1rem;
      margin-bottom: 1rem;
      color: white;
      background-color: rgba(212, 73, 80, 0.7);
    }

    &__block {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      border-radius: 0.3rem;
      border: none;
      background: white;
      box-shadow: inset 0 2px 6px 0 rgba(0, 0, 0, 0.3);
      padding: 0.5rem 0.7rem;
      position: relative;

      @media (min-width: 761px) {
        flex-wrap: nowrap;
      }
      @media (max-width: 760px) {
        box-shadow: none;
        padding: 1rem;
      }
    }
  }

  .result {
    display: flex;
    flex-wrap: wrap;
    border-radius: 0.3rem;
    margin-bottom: 3px;
    padding: 0.25rem 0.7rem;
    background-color: white;
    box-shadow: inset 0 2px 6px 0 rgba(0, 0, 0, 0.3);

    &:first-child {
      margin-bottom: 1rem;
      padding: 0.35rem 0.7rem;
      box-shadow: 0 0 3px rgba(255, 255, 255, 0.75);
      @media (max-width: 750px) {
        padding: 0.7rem;
      }
    }

    @media (max-width: 750px) {
      flex-wrap: wrap;
      padding: 0.7rem;
      margin-bottom: 0.5rem;
      box-shadow: none;
    }

    &__long-link {
      display: flex;
      width: calc(50% - 250px);
      flex: calc(50% - 250px);
      align-items: center;
      justify-content: flex-start;
      padding: 0;
      overflow: hidden;

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      @media (max-width: 1200px) {
        width: calc(70% - 250px);
        flex: 0 0 calc(70% - 250px);
      }

      @media (max-width: 750px) {
        margin: 0 0 1rem;
        width: 100%;
        flex: 100%;
        max-width: none;
      }
    }

    &__short-link {
      display: flex;
      width: calc(50% - 250px);
      flex: 0 0 calc(50% - 250px);
      align-items: center;
      justify-content: flex-start;
      padding: 0;
      margin-left: 2rem;
      transition: all 0.3s ease-in-out;

      a {
        color: rgba(110, 142, 251, 0.91);
        text-decoration: none;
        transition: .3s;
        &:hover {
          color: #667ce1;
        }
      }

      a {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      @media (max-width: 1200px) {
        width: calc(60% - 250px);
        flex: 0 0 calc(60% - 250px);
      }

      @media (max-width: 760px) {
        transition: none;
      }

      @media (max-width: 750px) {
        margin: 1rem 0;
        width: 100%;
      }
    }

    &__copy {
      width: 250px;
      padding: 0;
      margin-left: 2rem;
      display: flex;
      justify-content: flex-end;

      @media (max-width: 1200px) {
        margin-left: 1rem;
      }

      @media (max-width: 750px) {
        margin-left: 0;
        max-width: none;
        margin-top: 1rem;
        width: 100%;
      }
    }

    &__item {
      display: flex;
      flex-wrap: nowrap;
      width: 100%;

      @media (max-width: 750px) {
        flex-wrap: wrap;
      }
    }
  }

  .main-btn {
    background: linear-gradient(135deg, #6e8efb, #a777e3);
    padding: 0.6rem 1.25rem;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    border: none;
    color: white;
    font-size: 16px;
    white-space: nowrap;
    width: 135px;
    margin-left: auto;

    &__disabled {
      opacity: 0.5;
    }

    &:hover {
      cursor: pointer;
    }

    &:focus {
      outline: none;
    }

    @media (max-width: 760px) {
      margin-left: 0;
      margin-top: 0.75rem;
      width: 100%;
    }
  }

  .copy-btn {
    border: 1px solid #6e8efb;
    background: white;
    padding: 0.45rem 0.75rem;
    border-radius: 4px;
    color: #6e8efb;
    transition: 0.2s;
    display: flex;
    justify-content: center;
    margin-left: 0.6rem;
    width: 135px;

    &:hover {
      color: white;
      background: #6e8efb;
      cursor: pointer;
    }

    &_success {
      background-color: #f04b65;
      border: 1px solid #f04b65;
      color: white;

      &:hover {
        background-color: #f04b65;
      }
    }

    &:focus {
      outline: none;
    }

    @media (max-width: 750px) {
      margin: 0;
      width: 50%;
      margin-left: 0.2rem;
      display: flex;
      justify-content: center;
    }
  }

  .qr-btn {
    border: none;
    background: transparent;
    padding: 0.45rem 1.8rem;
    display: flex;
    margin-left: 1rem;

    &:hover {
      cursor: pointer;
      svg {
        filter: invert(1) brightness(0.2) sepia(1) hue-rotate(-70deg) saturate(4);
      }
    }

    &:focus {
      outline: none;
    }

    svg {
      filter: invert(1) brightness(0.3) sepia(1) hue-rotate(-60deg) saturate(4);
      width: 20px;
      transition: 0.2s;
    }

    @media (max-width: 750px) {
      width: 50%;
      justify-content: center;
      margin-right: 0.2rem;
      margin-left: 0;
    }
  }

  .clear-btn {
    display: flex;
    margin-left: auto;
    margin-right: 0.6rem;
    border: 1px solid white;
    background: transparent;
    padding: 0.5rem 0.75rem;
    border-radius: 4px;
    color: white;
    transition: 0.2s;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    width: 135px;
    height: 38px;

    &:hover {
      color: rgba(180, 63, 89, 1);
      background: white;
      border: 1px solid white;
      cursor: pointer;
      font-weight: bold;
    }

    &:focus {
      outline: none;
    }

    @media (max-width: 750px) {
      width: 100%;
    }
  }

  .copyright {
    text-transform: uppercase;
    margin: 30px 0;
    max-width: 1080px;
    width: 100%;
    text-align: right;
    color: white;
    font-size: 14px;
    display: flex;
    justify-content: flex-end;
    max-height: 20px;
    align-self: flex-end;

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
  .modal {
    display: flex;
    z-index: 1;
    position: absolute;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);

    &__qr {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: bold;
    }

    &__description {
      font-size: 0.65rem;
    }

    &__content {
      display: flex;
      flex-wrap: wrap;
      z-index: 1;
      padding: 1rem;
      width: 300px;
      height: 300px;
      justify-content: center;
      align-items: center;
      background: white;
      margin: 1rem auto;
      border-radius: 0.3rem;
      box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.2);
      box-sizing: border-box;

      span {
        flex: 100%;
      }
    }
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }

  .clear-icon {
    position: absolute;
    display: flex;
    width: 15px;
    height: 15px;
    right: 188px;
    cursor: pointer;
    border-radius: 50px;
    transition: 0.3s;
    background-size: contain;
    filter: invert(1) brightness(0.3) sepia(1) hue-rotate(-60deg) saturate(4);

    &:hover {
      filter: invert(1) brightness(0.2) sepia(1) hue-rotate(-70deg) saturate(4);
    }

    &::before {
      width: 100%;
      height: 2px;
      top: 6px;
      background-color: black;
      position: absolute;
      content: '';
      transform: rotate(45deg);
      border-radius: 10px;
    }

    &::after {
      width: 100%;
      height: 2px;
      top: 6px;
      background-color: black;
      position: absolute;
      content: '';
      transform: rotate(-45deg);
      border-radius: 10px;
    }

    @media (max-width: 750px) {
      top: 20px;
      right: 1rem;
    }
  }
</style>
