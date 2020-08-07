<template>
  <v-layout justify-center>
    <v-snackbar v-model="snackbar">
      {{ noiDung }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">Đóng</v-btn>
      </template>
    </v-snackbar>
    <div class="page-width c-flex">
      <div style="width: 100%; height: 400px;" class="d-flex">
        <div
          class="pt-1 pb-3 pl-3"
          style="width: 250px; height: 100%; background-color: #FCF3CF;"
          v-show="$vuetify.breakpoint.lgAndUp"
        >
          <div v-for="danhMuc in danhMucs" :key="danhMuc.id" style="height: 44px">
            <NuxtLink :to="'/danhmuc/' + danhMuc.id" class="d-flex align-center">
              <v-avatar size="36">
                <img
                  :src="danhMuc.anh_dai_dien ? END_POINT_IMAGE + danhMuc.anh_dai_dien : product "
                />
              </v-avatar>
              <div class="danh-muc">{{danhMuc.ten_danh_muc}}</div>
            </NuxtLink>
          </div>
        </div>
        <div style="height: 100%; object-fit: cover;" class="flex-fill">
          <v-carousel height="400" cycle hide-delimiter-background show-arrows-on-hover>
            <v-carousel-item
              v-for="(item,i) in sliders"
              :key="i"
              reverse-transition="fade-transition"
              transition="fade-transition"
            >
              <div
                class="image-cover"
                :style="{background: 'url(' + item.src + ')'}"
                style="color: red; height: 100%"
              ></div>
            </v-carousel-item>
          </v-carousel>
        </div>
        <div style="width: 300px; height: 100%; padding-left: 10px">
          <div style="width: 290px; height: 195px; margin-top: 5px">
            <img
              src="https://t.a4vn.com/2018/10/3/bo-anh-hot-girl-xinh-dep-khoe-dang-tao-bao-voi-bikini-ab8.png"
              style="height: 193px; width: 290px; border-radius: 15px"
            />
          </div>

          <div style="width: 290px; height: 195px; margin-top: 5px">
            <img
              src="https://sohanews.sohacdn.com/thumb_w/660/160588918557773824/2020/7/11/photo1594457983445-15944579858362004055205.jpg"
              style="height: 193px; width: 290px; border-radius: 15px"
            />
          </div>
        </div>
      </div>
      <div class="d-flex mt-5" style="justify-content: space-around">
        <div style="height: 80px" class="d-flex align-center">
          <img :src="customerIcon" height="40" />
          <span class="text-icon">100.000 ++ KHÁCH HÀNG</span>
        </div>
        <div style="height: 80px" class="d-flex align-center">
          <img :src="refershIcon" height="40" />
          <span class="text-icon">ĐỔI TRẢ HÀNG, HOÀN TIỀN</span>
        </div>
        <div style="height: 80px" class="d-flex align-center">
          <img :src="cartIcon" height="40" />
          <span class="text-icon">GIAO HÀNG ĐÚNG GIỜ</span>
        </div>
        <div style="height: 80px" class="d-flex align-center">
          <img :src="shipIcon" height="40" />
          <span class="text-icon">MIỄN PHÍ GIAO HÀNG</span>
        </div>
      </div>
      <v-text-field color="success" loading disabled v-if="loadSanPham"></v-text-field>
      <div
        style="margin-top: 50px; font-size: 28px; font-weight: bold"
      >Sản phẩm {{sanPham.ten_san_pham}}</div>
      <v-progress-linear color="green darken-2" rounded value="100"></v-progress-linear>
      <div class="d-flex" style="flex-wrap: wrap; margin-top: 20px">
        <div style="width: 650px; height: 450px;" class="c-flex">
          <v-img
            aspect-ratio="1.7"
            :src="(sanPham.anh_dai_dien && image) ? image : (sanPham.anh_dai_dien && !image) ? END_POINT_IMAGE + sanPham.anh_dai_dien : product"
            style="width: 550px; height: 450px"
          />
        </div>
        <div class="c-flex flex-fill" style="height: 400px;">
          <div
            style="font-size: 28px; font-weight: bold; margin-bottom: 10px; text-align:center"
          >{{sanPham.ten_san_pham}}</div>
          <div class="c-flex khung-thuoctinh">
            <div
              style="color: green; font-size: 28px; font-weight: bold"
            >{{formatCurrency(sanPham.gia_ban)}} đ/{{sanPham.don_vi_tinh}}</div>
            <div class="thuoc-tinh" style="margin-top: 40px">Đơn vị tính: {{sanPham.don_vi_tinh}}</div>
            <div
              class="thuoc-tinh"
            >Thương hiệu: {{sanPham.thuong_hieu ? sanPham.thuong_hieu.ten: ''}}</div>
            <div
              class="thuoc-tinh"
            >Thuộc danh mục: {{sanPham.danh_muc ? sanPham.danh_muc.ten_danh_muc : ""}}</div>
          </div>
          <div class="d-flex">
            <div style="width: 200px" class="mr-4">
              <v-text-field
                v-model="soLuong"
                height="50"
                type="number"
                :min="0"
                label="Số lượng"
                outlined
                dense
              ></v-text-field>
            </div>
            <v-btn x-large color="success" dark @click="addGioHang">
              <v-icon left>mdi-cart</v-icon>THÊM VÀO GIỎ
            </v-btn>
          </div>
        </div>
      </div>
      <div
        class="d-flex mt-5 pr-6"
        style="width: 650px"
        v-if="sanPham.hinh_anhs && sanPham.hinh_anhs.length > 0"
      >
        <div
          style="height: 130px; width: 130px"
          class="mr-3"
          v-for="hinhanh in sanPham.hinh_anhs"
          :key="hinhanh.id"
        >
          <v-card elevation="12" tile class="d-flex" @click="showHinhAnh(hinhanh.url_hinh_anh)">
            <v-img
              :src="END_POINT_IMAGE + hinhanh.url_hinh_anh"
              :lazy-src="END_POINT_IMAGE + hinhanh.url_hinh_anh"
              aspect-ratio="1"
              class="grey lighten-2"
            >
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-card>
        </div>
      </div>
      <div style="font-size: 24px; font-weight: bold; margin-top: 20px">Mô tả sản phẩm</div>
      <div style="margin-top: 20px" v-html="parseText(sanPham.mo_ta_san_pham)"></div>
    </div>
  </v-layout>
</template>
<script>
import md from "marked";

import api from "@/api";
import product from "@/assets/image/product.png";
import customerIcon from "assets/image/icon/people.png";
import refershIcon from "assets/image/icon/refresh.png";
import cartIcon from "assets/image/icon/cart.png";
import shipIcon from "assets/image/icon/delivery.png";
import { END_POINT_IMAGE } from "@/env";

import { mapMutations } from "vuex";
export default {
  layout: "header",
  data: () => ({
    sanPham: {
      ten_san_pham: "",
      gia_ban: "",
      danh_muc: {
        ten_danh_muc: "",
      },
      hinh_anhs: [],
    },
    snackbar: false,
    noiDung: "",
    soLuong: 1,
    image: null,
    danhMucs: [],
    page: 1,
    per_page: 20,
    total_page: 1,
    loadSanPham: true,
    product: product,
    customerIcon: customerIcon,
    refershIcon: refershIcon,
    cartIcon: cartIcon,
    shipIcon: shipIcon,
    END_POINT_IMAGE: END_POINT_IMAGE,
    sliders: [
      {
        src:
          "https://znews-photo.zadn.vn/w660/Uploaded/lce_qdhuc/2019_04_20/thumb1.jpg",
      },
      {
        src:
          "https://image.winudf.com/v2/image1/Z3NleHkuaG90Z2lybHMuZ2FpeGluaC5nc2V4eV9zY3JlZW5fNl8xNTQ0OTQ5NTkxXzA0MA/screen-6.jpg?fakeurl=1&type=.jpg",
      },
      {
        src:
          "https://thuthuatnhanh.com/wp-content/uploads/2018/07/anh-girl-xinh-gai-dep.jpg",
      },
    ],
  }),
  computed: {},
  mounted() {
    this.getSanPham();
    this.getDanhMuc();
  },
  methods: {
    async getSanPham() {
      this.loadSanPham = true;
      let data = await api.get("sanphamtrangchu/" + this.$route.params.id);
      this.loadSanPham = false;
      this.sanPham = data.data;
    },
    async getDanhMuc() {
      let data = await api.get("danhmuc", { per_page: 9 });
      this.danhMucs = data.data.data;
    },
    PaginateSanPham(val) {
      this.page = val;
      this.getSanPham();
    },
    formatCurrency(n, separate = ".") {
      try {
        if (!n) n = 0;
        var s = parseInt(n).toString();
        var regex = /\B(?=(\d{3})+(?!\d))/g;
        var ret = s.replace(regex, separate);
        return ret;
      } catch (error) {
        return "0";
      }
    },
    showHinhAnh(val) {
      this.image = END_POINT_IMAGE + val;
    },
    addGioHang() {
      if (this.soLuong < 1) {
        this.snackbar = true;
        this.noiDung = "Số lượng sản phẩm không hợp lệ";
        return;
      }
      let product = JSON.parse(localStorage.getItem("gio_hang"));
      if (!product) {
        product = [];
      }
      let sP = {};

      let check = product.find((el) => el.san_pham_id == this.$route.params.id);
      if (check) {
        check.so_luong = check.so_luong + this.soLuong;
      } else {
        sP.so_luong = this.soLuong;
        sP.san_pham_id = this.$route.params.id;
        product.push(sP);
      }

      let so_luong = 0;
      for (let item of product) {
        so_luong = Number(so_luong) + Number(item.so_luong);
      }
      this.$store.commit("giohang/add", so_luong);
      localStorage.setItem("gio_hang", JSON.stringify(product));
      this.snackbar = true;
      this.noiDung = "Đã thêm vào giỏ hàng";
    },
    parseText(text) {
      if (text) {
        return md.parse(text);
      } else return null;
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
.thuoc-tinh {
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: bold;
}
.khung-thuoctinh {
  border: 2px solid green;
  padding-left: 20px;
  padding-top: 15px;
  border-radius: 20px;
  margin-bottom: 20px;
}
.chon-anh {
  border: red solid 1px;
}
</style>