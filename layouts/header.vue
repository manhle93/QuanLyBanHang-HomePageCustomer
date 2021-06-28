<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="leftMenu" app temporary>
      <div style="height: 100%; display: flex; flex-direction: column">
        <div
          class="d-flex pl-4"
          style="
            background-color: #f5b041;
            font-size: 20px;
            font-weight: bold;
            align-items: center;
            height: 60px;
            width: 100%;
          "
        >
          <v-icon style="margin-right: 15px">mdi-menu</v-icon>DANH MỤC
        </div>
        <div
          class="page-width c-flex"
          style="
            width: 100%;
            background-color: #196f3d;
            padding-top: 10px;
            padding-bottom: 10px;
            padding-left: 10px;
          "
        >
          <div class="d-flex" style="padding-bottom: 10px">
            <img
              src="https://image.flaticon.com/icons/svg/415/415753.svg"
              height="25"
            />
            <nuxt-link to="/homnayangi" style="margin-left: 15px">
              <div style="color: white">Hôm nay ăn gì</div>
            </nuxt-link>
          </div>
          <div class="d-flex" style="padding-bottom: 10px">
            <img
              src="https://image.flaticon.com/icons/svg/3163/3163689.svg"
              height="25"
            />
            <nuxt-link to="/sanphambanchay" style="margin-left: 15px">
              <div style="color: white">Sản phẩm bán chạy</div>
            </nuxt-link>
          </div>
          <div class="d-flex">
            <img
              src="https://image.flaticon.com/icons/svg/3199/3199306.svg"
              height="25"
            />
            <nuxt-link to="/sinhthairuongbacthang" style="margin-left: 15px">
              <div style="color: white">Sinh thái Ruộng Bậc Thang</div>
            </nuxt-link>
          </div>
        </div>
        <div
          dense
          class="pt-4 pl-4"
          style="height: 100%; background-color: #fff"
        >
          <div
            v-for="danhMuc in danhMucs"
            :key="danhMuc.id"
            style="height: 45px"
          >
            <NuxtLink
              :to="'/danhmuc/' + danhMuc.id"
              class="d-flex align-center"
            >
              <v-avatar size="36">
                <img
                  :src="
                    danhMuc.anh_dai_dien
                      ? END_POINT_IMAGE + danhMuc.anh_dai_dien
                      : product
                  "
                />
              </v-avatar>
              <div class="danh-muc">{{ danhMuc.ten_danh_muc }}</div>
            </NuxtLink>
          </div>
        </div>
        <div style="text-align: center; margin-bottom: 100px" v-if="!loggedIn">
          <nuxt-link to="/dangky">
            <v-btn class="mr-2" small color="primary">Đăng ký</v-btn>
          </nuxt-link>
          <nuxt-link to="/dangnhap">
            <v-btn class small color="orange">Đăng nhập</v-btn>
          </nuxt-link>
        </div>
      </div>
    </v-navigation-drawer>
    <v-app-bar app color="green" dark height="135">
      <div
        class="d-flex align-center flex-column"
        style="
          width: calc(100% + 32px);
          height: 100%;
          margin-left: -16px;
          margin-right: -16px;
          margin-bottom: -8px;
        "
      >
        <div class="d-flex align-center page-width" style="height: 85px">
          <v-app-bar-nav-icon
            @click.stop="leftMenu = !leftMenu"
            v-show="!$vuetify.breakpoint.lgAndUp"
          ></v-app-bar-nav-icon>
          <NuxtLink to="/" class="d-flex">
            <v-toolbar-title>
              <div style="background: white; padding: 8px 8px 0px 8px">
                <img :src="logo" height="50" />
              </div>
            </v-toolbar-title>
            <!-- <div class="c-flex ml-3 phone" style="align-items: flex-start;">
              <v-btn
                @mouseover="showFace"
                @mouseleave="hideFace"
                v-show="!faceShow"
                class="mb-1"
                x-small
                dark
                fab
                color="indigo"
              >
                <v-icon>mdi-facebook</v-icon>
              </v-btn>
              <v-btn
                class="mb-1"
                @mouseover="showFace"
                @mouseleave="hideFace"
                small
                dark
                color="indigo"
                v-show="faceShow"
              >
                <v-icon class="mr-3">mdi-facebook</v-icon>
                <span style="font-size: 16px">RBT</span>
              </v-btn>

              <v-btn
                v-show="!phoneShow"
                @mouseover="showPhone"
                @mouseleave="hidePhone"
                x-small
                dark
                fab
                color="pink"
              >
                <v-icon>mdi-phone</v-icon>
              </v-btn>

              <v-btn
                @mouseover="showPhone"
                @mouseleave="hidePhone"
                small
                dark
                color="pink"
                v-show="phoneShow"
              >
                <v-icon class="mr-3">mdi-phone</v-icon>
                <span style="font-size: 16px">08.666.99806</span>
              </v-btn>
            </div>-->
          </NuxtLink>
          <div
            class="flex-fill d-flex align-center ml-4"
            style="height: 100%; justify-content: center"
          >
            <v-text-field
              v-model="search"
              light
              background-color="white"
              color="black"
              label="Tìm kiếm"
              solo
              hide-details
              style="max-width: 400px; border-radius: 5px"
              prepend-inner-icon="mdi-yeast"
              @keyup.enter="timKiem"
              class="tim-kiem"
            ></v-text-field>
          </div>
          <div class="d-flex mr-6 ml-3">
            <!-- <v-btn x-small dark fab color="indigo" class="mr-3">
              <v-icon>mdi-facebook</v-icon>
            </v-btn>-->
            <a href>
              <img
                src="https://image.flaticon.com/icons/svg/145/145802.svg"
                height="33"
                class="mr-3"
              />
            </a>
            <div class="pr-4 d-flex">
              <a href="tel:+84862968081">
                <v-btn x-small dark fab color="pink">
                  <v-icon>mdi-phone</v-icon>
                </v-btn>
              </a>
              <span
                style="font-size: 20px; font-weight: bold; font-style: italic; font-family: 'time new roman"
                class="mt-1 ml-1 so-dien-thoai"
                ><a href="tel:+84862968081" style="color: white"
                  >086.296.8081</a
                ></span
              >
            </div>
          </div>
          <nuxt-link to="/dangky" v-if="!loggedIn">
            <v-btn class="mr-2 button" small color="primary">Đăng ký</v-btn>
          </nuxt-link>
          <nuxt-link to="/dangnhap" v-if="!loggedIn">
            <v-btn class="mr-4 button" small color="orange">Đăng nhập</v-btn>
          </nuxt-link>

          <v-menu
            bottom
            origin="center center"
            transition="scale-transition"
            v-if="loggedIn"
          >
            <template v-slot:activator="{ on }">
              <v-btn icon large v-on="on" class="mr-4">
                <!-- <v-avatar size="40px" item v-if="user.anh_dai_dien">
              <v-img :src="endPoint+ user.anh_dai_dien" alt="Vuetify"></v-img>
            </v-avatar>
            <v-avatar size="40px" item v-else>
              <v-img src="./assets/avatar.jpg" alt="Vuetify"></v-img>
                </v-avatar>-->
                <v-avatar>
                  <img
                    :src="User.avatar ? END_POINT_IMAGE + User.avatar : avatar"
                    alt="John"
                  />
                </v-avatar>
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="aboutMe">
                <v-list-item-title>
                  <v-icon class="mr-3">mdi-account</v-icon>Thông tin cá nhân
                </v-list-item-title>
              </v-list-item>

              <v-list-item @click="logOut">
                <v-list-item-title>
                  <v-icon class="mr-3">mdi-backup-restore</v-icon>Đăng xuất
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <!-- <v-btn small class="mr-4 user-name" outlined color="white" v-if="loggedIn">{{User.name}}</v-btn> -->
          <nuxt-link to="/giohang" class="pr-6">
            <v-badge color="red" :content="soLuongGioHang">
              <v-icon>mdi-cart</v-icon>
            </v-badge>
          </nuxt-link>
        </div>
        <div
          class="flex-fill d-flex"
          style="
            background-color: #196f3d;
            width: 100%;
            justify-content: center;
          "
        >
          <div
            class="page-width d-flex align-center"
            style="width: 250px; height: 100%; background-color: #f5b041"
            v-if="$vuetify.breakpoint.lgAndUp"
          >
            <v-icon style="margin-left: 10px">mdi-menu</v-icon>
            <div style="margin-left: 10px">DANH MỤC</div>
          </div>
          <div
            class="page-width d-flex align-center"
            style="
              width: 650px;
              height: 100%;
              background-color: #196f3d;
              justify-content: space-around;
            "
          >
            <img
              class="khuyen-mai"
              src="https://image.flaticon.com/icons/svg/415/415753.svg"
              height="25"
            />
            <nuxt-link to="/bepnharuong">
              <div class="tieu-de" style="color: white">Bếp Nhà Ruộng</div>
            </nuxt-link>
            <img
              class="khuyen-mai"
              src="https://image.flaticon.com/icons/svg/3163/3163689.svg"
              height="25"
            />
            <nuxt-link to="/sanphambanchay">
              <div class="tieu-de" style="color: white">Sản phẩm bán chạy</div>
            </nuxt-link>
            <img
              class="khuyen-mai"
              src="https://image.flaticon.com/icons/svg/3199/3199306.svg"
              height="25"
            />
            <nuxt-link to="/sinhthairuongbacthang">
              <div class="tieu-de" style="color: white">
                Sinh thái Ruộng Bậc Thang
              </div>
            </nuxt-link>
            <div class="search-mobile">
              <v-form v-on:submit.prevent="timKiem">
                <input
                  v-model="search"
                  style="
                    height: 35px;
                    width: 350px;
                    background-color: white;
                    border-radius: 5px;
                  "
                  type="text"
                  placeholder="Hôm nay bạn muốn ăn gì?"
                />
              </v-form>
            </div>
          </div>
          <div
            class="page-width khuyen-mai d-flex align-center"
            style="
              width: 300px;
              height: 100%;
              background-color: #196f3d;
              padding-left: 40px;
            "
          >
            <img
              class="khuyen-mai"
              src="https://image.flaticon.com/icons/svg/415/415753.svg"
              height="25"
            />
            <nuxt-link to="/homnayangi" style="margin-left: 20px">
              <div class="tieu-de" style="color: white">Hôm nay ăn gì</div>
            </nuxt-link>
          </div>
        </div>
      </div>
    </v-app-bar>

    <v-main>
      <nuxt />
    </v-main>
    <!-- <v-footer
      :style="{background: 'url('+ footer +')'}"
      style="width: 100%; height: 250px"
      class="image-cover"
    >
    </v-footer>-->
    <v-footer style="margin-top: 25px">
      <v-layout justify-center>
        <div
          style="
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            flex-wrap: wrap;
          "
          class="page-width"
        >
          <div style="height: 100%; padding-top: 20px">
            <img :src="logo" style="height: 90px" class="footer" />
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              justify-content: space-around;
            "
            class="pl-4"
          >
            <div style="font-size: 16px; font-weight: bold">
              RUỘNG BẬC THANG
            </div>
            <div style="font-size: 14px">Số ĐKKD: 21A8000753</div>
            <div style="font-size: 14px">
              Hotline: 086.296.8081 - Email: hotro@ruongbacthang.com.vn
            </div>
            <div style="font-size: 14px">
              Địa chỉ: 82-84 Ngọc Hân Công Chúa – Tp Bắc Ninh
            </div>
          </div>
          <div
            style="
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            "
          >
            <div>
              <img
                :src="logoBoCongThuong"
                style="height: 65px"
                class="footer"
              />
            </div>
            <a
              href="https://play.google.com/store/apps/details?id=vn.skymapglobal.rbt_khachhang"
              target="_blank"
            >
              <img :src="playStoreIcon" style="height: 40px" />
            </a>
            <a
              href="https://apps.apple.com/vn/app/ru%E1%BB%99ng-b%E1%BA%ADc-thang/id1529846199"
              target="_blank"
            >
              <img :src="appStoreIcon" style="height: 40px" />
            </a>
          </div>
        </div>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import api from "@/api";
import logo from "@/assets/image/logo.jpg";
import logoBoCongThuong from "@/assets/image/logobct.png";
import logonew from "@/assets/image/logonew.jpg";
import { END_POINT_IMAGE } from "@/env";
import product from "@/assets/image/product.png";
import avatar from "@/assets/image/avatar_none.png";
import footer from "@/assets/image/footer.png";
import playStoreIcon from "@/assets/image/google.png";
import appStoreIcon from "@/assets/image/apple.png";

export default {
  props: {
    source: String,
  },
  data: () => ({
    leftMenu: false,
    playStoreIcon,
    appStoreIcon,
    logo: logo,
    logonew: logonew,
    logoBoCongThuong: logoBoCongThuong,
    avatar: avatar,
    footer: footer,
    danhMucs: [],
    END_POINT_IMAGE: END_POINT_IMAGE,
    product: product,
    search: null,
    loggedIn: false,
    phoneShow: false,
    faceShow: false,
    User: {
      name: "",
      avatar_url: null,
      roles: null,
    },
  }),
  mounted() {
    this.getDanhMuc();
    this.getSoLuongGioHang();
    this.me();
  },
  computed: {
    soLuongGioHang: {
      get() {
        return this.$store.state.giohang.soLuong;
      },
      set(val) {
        this.$store.commit("giohang/add", val);
      },
    },
  },
  methods: {
    async me() {
      try {
        let data = await api.get("auth/me");
        this.User = data.data.data;
        this.loggedIn = true;
      } catch (error) {
        this.loggedIn = false;
      }
    },
    showPhone() {
      this.phoneShow = true;
    },
    hidePhone() {
      this.phoneShow = false;
    },
    showFace() {
      this.faceShow = true;
    },
    hideFace() {
      this.faceShow = false;
    },
    async logOut() {
      try {
        await api.post("auth/logout");
        api.deleteToken();
        // this.me();
        window.location.assign("/");
      } catch (error) {}
    },
    myOrder() {},
    aboutMe() {
      this.$router.push("/trangcanhan");
    },
    getSoLuongGioHang() {
      let product = JSON.parse(localStorage.getItem("gio_hang"));
      if (!product || product.length == 0) {
        this.soLuongGioHang = 0;
        return;
      }
      let so_luong = 0;
      for (let item of product) {
        so_luong = Number(so_luong) + Number(item.so_luong);
      }
      this.soLuongGioHang = so_luong;
    },

    async getDanhMuc() {
      let data = await api.get("danhmuckinhdoanh", { per_page: 999999 });
      this.danhMucs = data.data.data;
    },
    timKiem() {
      if (this.search == null || this.search == "") {
        this.$router.push("/");
      } else this.$router.push("/timkiem/" + this.search);
    },
  },
};
</script>
<style scoped>
.c-flex {
  display: flex;
  flex-direction: column;
}
.phone {
  width: 40px;
}
.danh-muc {
  font-size: 14px;
  font-weight: bold;
  margin-left: 15px;
}
.text-icon {
  font-size: 16px;
  font-weight: bold;
  padding-left: 15px;
}
.tieu-de {
  font-size: 16px;
}
.search-mobile {
  display: none;
}
@media only screen and (max-width: 1100px) {
  .so-dien-thoai {
    display: none;
  }
}
@media only screen and (max-width: 800px) {
  .so-dien-thoai {
    display: none;
  }
  .user-name {
    display: none;
  }
  .phone {
    width: 180px;
  }
}
@media only screen and (max-width: 600px) {
  .footer {
    display: none;
  }
  .button {
    display: none;
  }
  .tim-kiem {
    display: none;
  }
  .khuyen-mai {
    width: 0px !important;
    display: none !important;
  }
  .tieu-de {
    display: none;
  }
  .search-mobile {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  ::placeholder {
    padding-left: 15px;
    font-style: italic;
  }
  .user-name {
    display: none;
  }
}
</style>