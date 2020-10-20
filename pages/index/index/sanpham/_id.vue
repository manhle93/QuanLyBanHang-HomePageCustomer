<template>
  <v-layout justify-center>
    <v-snackbar v-model="snackbar">
      {{ noiDung }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">Đóng</v-btn>
      </template>
    </v-snackbar>
    <div class="page-width c-flex">
      <v-text-field color="success" loading disabled v-if="loadSanPham"></v-text-field>
      <!-- <div
        class="ml-3"
        style="margin-top: 0px; font-size: 28px; font-weight: bold"
      >Sản phẩm {{sanPham.ten_san_pham}}</div>-->
      <v-progress-linear color="green darken-2" rounded value="100" style="height: 2px"></v-progress-linear>
      <div class="d-flex" style="flex-wrap: wrap; margin-top: 20px; justify-content: center">
        <div style="max-width: 90%; height: 450px;" class="c-flex">
          <v-img
            aspect-ratio="1.7"
            :src="(sanPham.anh_dai_dien && image) ? image : (sanPham.anh_dai_dien && !image) ? END_POINT_IMAGE + sanPham.anh_dai_dien : product"
            style="width: 550px; height: 450px"
          >
            <v-btn
              small
              color="pink"
              dark
              v-if="!sanPham.san_pham_ton_kho || !sanPham.san_pham_ton_kho.so_luong > 0"
            >Hết hàng</v-btn>
            <v-btn small color="success" dark v-else>Còn hàng</v-btn>
          </v-img>
        </div>
        <div class="c-flex flex-fill thongtin-sanpham" style="height: 400px; max-width: 90%">
          <div
            style="font-size: 30px; font-weight: light; margin-bottom: 10px;"
          >{{sanPham.ten_san_pham.toUpperCase()}}</div>
          <div class="c-flex khung-thuoctinh">
            <div
              style="color: green; font-size: 24px; font-weight: 500"
            >{{formatCurrency(sanPham.gia_ban)}} đ</div>
            <div class="thuoc-tinh" style="margin-top: 20px">Đơn vị tính: {{sanPham.don_vi_tinh}}</div>
            <div
              class="thuoc-tinh"
            >Thương hiệu: {{sanPham.thuong_hieu ? sanPham.thuong_hieu.ten: ''}}</div>
            <div
              class="thuoc-tinh"
            >Thuộc danh mục: {{sanPham.danh_muc ? sanPham.danh_muc.ten_danh_muc : ""}}</div>
            <div
              v-if="(!sanPham.san_pham_ton_kho || !sanPham.san_pham_ton_kho.so_luong > 0)"
              class="co-hang"
            >Dự kiến TG nhập hàng: {{ new Date().getDate() +1 }}/{{ new Date().getMonth()+1 }} </div>
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
            <v-btn
              v-if="(!sanPham.san_pham_ton_kho || !(sanPham.san_pham_ton_kho.so_luong > 0))"
              x-large
              color="pink"
              dark
              @click="datTruoc()"
            >
              <v-icon left>mdi-cart</v-icon>ĐẶT TRƯỚC
            </v-btn>
            <v-btn v-else x-large color="success" dark @click="addGioHang()">
              <v-icon left>mdi-cart</v-icon>THÊM VÀO GIỎ
            </v-btn>
          </div>
          <nuxt-link :to="'/'">
            <v-btn class="tiep-tuc" color="indigo" dark>
              <v-icon left>mdi-arrow-left</v-icon>TIẾP TỤC MUA HÀNG
            </v-btn>
          </nuxt-link>
        </div>
      </div>
      <div class="d-flex album-anh" v-if="sanPham.hinh_anhs && sanPham.hinh_anhs.length > 0">
        <div
          style="height: 130px; width: 100px"
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
      <div class="ml-3" style="font-size: 24px; font-weight: bold; margin-top: 20px">Mô tả sản phẩm</div>
      <div style="margin-top: 20px" class="mo-ta" v-html="parseText(sanPham.mo_ta_san_pham)"></div>
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
    datTruoc() {
      if (this.soLuong < 1) {
        this.snackbar = true;
        this.noiDung = "Số lượng sản phẩm không hợp lệ";
        return;
      }
      let product = JSON.parse(localStorage.getItem("dat_truoc"));
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
      // this.$store.commit("giohang/add", so_luong);
      localStorage.setItem("dat_truoc", JSON.stringify(product));
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
.co-hang {
  font-size: 14px;
  font-style: italic;
  color: red;
  margin-bottom: 10px;
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
  /* border: 2px solid green;
  padding-left: 20px; */
  padding-top: 15px;
  border-radius: 20px;
  margin-bottom: 20px;
}
.thongtin-sanpham {
  margin-left: 50px;
}
.album-anh {
  margin-top: 20px;
  max-width: 600px;
  flex-wrap: wrap;
}
@media only screen and (max-width: 600px) {
  .thongtin-sanpham {
    margin-left: 0px;
  }
  .album-anh {
    max-width: 100%;
    margin-top: -20px;
    margin-left: 25px;
  }
  .tiep-tuc {
    display: none;
  }
}
</style>