<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="leftMenu" app temporary class="d-flex">
      <!-- <v-list dense>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-home</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-action>
            <v-icon>mdi-email</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Contact</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>-->
      <div
        class="d-flex pl-4"
        style="background-color: #F5B041; font-size: 20px; font-weight: bold; align-items: center; height: 60px; width: 100%;"
      >
        <v-icon style="margin-right: 15px">mdi-menu</v-icon>DANH MỤC
      </div>

      <div dense class="pt-4 pl-4" style="height: 100%; background-color: #fff">
        <div v-for="danhMuc in danhMucs" :key="danhMuc.id" style="height: 45px">
          <NuxtLink :to="'/danhmuc/' + danhMuc.id" class="d-flex align-center">
            <v-avatar size="36">
              <img :src="danhMuc.anh_dai_dien ? END_POINT_IMAGE + danhMuc.anh_dai_dien : product " />
            </v-avatar>
            <div class="danh-muc">{{danhMuc.ten_danh_muc}}</div>
          </NuxtLink>
        </div>
      </div>
    </v-navigation-drawer>
    <v-app-bar app color="green" dark height="135">
      <div
        class="d-flex align-center flex-column"
        style="width: calc(100% + 32px); height: 100%; margin-left: -16px; margin-right: -16px; margin-bottom: -8px"
      >
        <div class="d-flex align-center page-width" style="height: 85px;">
          <v-app-bar-nav-icon
            @click.stop="leftMenu = !leftMenu"
            v-show="!$vuetify.breakpoint.lgAndUp"
          ></v-app-bar-nav-icon>
          <NuxtLink to="/">
            <v-toolbar-title>
              <img :src="logo" height="50" />
            </v-toolbar-title>
          </NuxtLink>
          <div class="flex-fill d-flex align-center" style="height: 100%; justify-content: center">
            <v-text-field
              v-model="search"
              light
              background-color="white"
              color="black"
              label="Tìm kiếm"
              solo
              hide-details
              style="max-width: 500px; border-radius: 50px"
              prepend-inner-icon="mdi-yeast"
              @keyup.enter="timKiem"
            ></v-text-field>
          </div>
          <v-btn class="mr-2" small color="primary">Đăng ký</v-btn>
          <v-btn class="mr-4" small color="orange">Đăng nhập</v-btn>
          <nuxt-link to="/giohang">
            <v-badge color="red" :content="soLuongGioHang">
              <v-icon>mdi-cart</v-icon>
            </v-badge>
          </nuxt-link>
        </div>
        <div
          class="flex-fill d-flex"
          style="background-color: #196F3D; width: 100%; justify-content: center"
        >
          <div
            class="page-width d-flex align-center"
            style="width: 250px; height: 100%; background-color: #F5B041"
            v-if="$vuetify.breakpoint.lgAndUp"
          >
            <v-icon style="margin-left: 10px">mdi-menu</v-icon>
            <div style="margin-left: 10px">DANH MỤC</div>
          </div>
          <div class="page-width d-flex align-center" style="width: 650px; height: 100%; background-color: #196F3D; justify-content: space-around">
            <img src="https://image.flaticon.com/icons/svg/415/415753.svg" height="25">
            <div class="tieu-de">Món ngon mỗi ngày </div>
            <img src="https://image.flaticon.com/icons/svg/3163/3163689.svg" height="25">
            <div class="tieu-de">Khuyễn mãi hot  </div>
            <img src="https://image.flaticon.com/icons/svg/3199/3199306.svg" height="25">
            <div class="tieu-de">Sản phẩm bán chạy</div>
                              
          </div>
          <div class="page-width" style="width: 300px; height: 100%; background-color: #196F3D"></div>
        </div>
      </div>
    </v-app-bar>

    <v-main>
      <nuxt />
    </v-main>
    <!-- <v-footer color="indigo" app>
      <span class="white--text">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>-->
  </v-app>
</template>

<script>
import api from "@/api";
import logo from "@/assets/image/logo.jpg";
import { END_POINT_IMAGE } from "@/env";
import product from "@/assets/image/product.png";
export default {
  props: {
    source: String,
  },
  data: () => ({
    leftMenu: false,
    logo: logo,
    danhMucs: [],
    END_POINT_IMAGE: END_POINT_IMAGE,
    product: product,
    search: null,
  }),
  mounted() {
    this.getDanhMuc();
    this.getSoLuongGioHang()
  },
  computed: {
    soLuongGioHang: {
      get () {
        return this.$store.state.giohang.soLuong;
      },
      set (val) {
        this.$store.commit('giohang/add', val)
      }
    },
  },
  methods: {
    getSoLuongGioHang() {
      let product = JSON.parse(localStorage.getItem("gio_hang"));
      if (!product || product.length == 0) {
        this.soLuongGioHang = 0
        return
      }
      let so_luong = 0;
      for (let item of product) {
        so_luong = Number(so_luong) + Number(item.so_luong);
      }
      this.soLuongGioHang = so_luong
    },

    async getDanhMuc() {
      let data = await api.get("danhmuc", { per_page: 999999 });
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
  font-weight: bold;
}
</style>