<template>
  <v-layout justify-center>
    <div class="page-width">
      <v-snackbar v-model="snackbar">
        {{ noiDung }}
        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">Đóng</v-btn>
        </template>
      </v-snackbar>
      <div style="margin-top: 50px; font-size: 26px; font-weight: bold">GIỎ HÀNG</div>
      <v-progress-linear color="green darken-2" rounded value="100"></v-progress-linear>
      <v-text-field color="success" loading disabled v-if="loadSanPham"></v-text-field>
      <div
        style="margin-top: 30px; display: flex; flex-direction: row-reverse; flex-wrap: wrap;"
        v-else
      >
        <div
          class="d-flex"
          style="height: 140px; width: 100%"
          v-for="sanPham in sanPhams"
          :key="sanPham.id"
        >
          <div style="width: 200px; height: 100%;">
            <v-img
              :src="sanPham.anh_dai_dien ? END_POINT_IMAGE +sanPham.anh_dai_dien : product"
              aspect-ratio="1.7"
              style="max-width: 200px; max-height: 140px; border-radius: 15px"
            ></v-img>
          </div>
          <div style="height: 100%" class="flex-fill c-flex ml-6">
            <div class="d-flex" style="justify-content: space-between">
              <div class="danh-muc">{{sanPham.ten_san_pham}}</div>
              <div class="danh-muc mr-8">{{formatCurrency(sanPham.gia_ban)}} đ</div>
            </div>
            <div>Danh mục: {{sanPham.danh_muc ? sanPham.danh_muc.ten_danh_muc : ""}}</div>
            <v-btn class="mx-2 mt-4" x-small fab dark color="pink" @click="xoaSanPham(sanPham.id)">
              <v-icon dark>mdi-delete</v-icon>
            </v-btn>
          </div>
          <div style="width: 200px; height: 100%;">
            <v-text-field
              @change="doiSoLuong(sanPham.so_luong)"
              v-model="sanPham.so_luong"
              style="width: 80%"
              label="Số lượng"
              :min="1"
              type="number"
              outlined
              dense
            ></v-text-field>
          </div>
        </div>
      </div>
      <div v-if="sanPhams.length > 0">
        <div class="d-flex">
          <div style="width: 300px">
            <v-text-field v-model="giamGia" style="width: 300px" label="Mã giảm giá" outlined dense></v-text-field>
          </div>
          <v-btn class="ml-4" color="primary">Áp dụng</v-btn>
        </div>
        <div class="dat-hang">Giảm giá: {{formatCurrency(giamGia)}} đ</div>
        <div class="dat-hang">
          Tổng thanh toán:
          <span style="color: green; font-size: 22px">{{formatCurrency(tongTien)}} đ</span>
        </div>
        <v-btn class="mt-3" style="color: white" color="green">ĐẶT HÀNG</v-btn>
      </div>
      <div v-else style="width: 100%; text-align: center;">
        <img class="mb-4" :src="emptyCard" height="350px" />
        <div class="mb-6">Không có sản phẩm nào trong giỏ hàng của bạn</div>
        <nuxt-link to="/">
          <v-btn color="primary">Tiếp tục mua sắm</v-btn>
        </nuxt-link>
      </div>
    </div>
  </v-layout>
</template>

<script>
import api from "@/api";
import { END_POINT_IMAGE } from "@/env";
import product from "@/assets/image/product.png";
import customerIcon from "assets/image/icon/people.png";
import refershIcon from "assets/image/icon/refresh.png";
import cartIcon from "assets/image/icon/cart.png";
import emptyCard from "assets/image/empty_cart.png";
export default {
  layout: "header",
  data: () => ({
    sanPhams: [],
    danhMucs: [],
    emptyCard: emptyCard,
    END_POINT_IMAGE: END_POINT_IMAGE,
    giamGia: 0,
    tongTien: 0,
    page: 1,
    per_page: 20,
    total_page: 1,
    giamGia: "",
    noiDung: "",
    snackbar: false,
    loadSanPham: true,
    product: product,
    customerIcon: customerIcon,
    refershIcon: refershIcon,
    cartIcon: cartIcon,
  }),
  mounted() {
    this.getSanPham();
    this.getDanhMuc();
  },
  methods: {
    async getSanPham() {
      this.loadSanPham = true;
      let product = JSON.parse(localStorage.getItem("gio_hang"));
      if (!product) {
        this.loadSanPham = false;
        this.sanPhams = [];
        return;
      }
      let san_pham_id = product.map((el) => Number(el.san_pham_id));
      let data = await api.get("sanphamgiohang", {
        san_pham_id: san_pham_id,
      });
      this.sanPhams = data.data;
      for (let item of this.sanPhams) {
        for (let i of product) {
          if (i.san_pham_id == item.id) {
            item["so_luong"] = i.so_luong;
          }
        }
      }
      this.tinhTongTien();
      this.loadSanPham = false;
    },
    xoaSanPham(id) {
      let index = this.sanPhams.findIndex((el) => el.id == id);
      this.sanPhams.splice(index, 1);
      if (this.sanPhams.length == 0) {
        localStorage.removeItem("gio_hang");
        this.$store.commit("giohang/remove");
      } else {
        let sp = [];
        for (let item of this.sanPhams) {
          let i = {};
          i.san_pham_id = item.id;
          i.so_luong = item.so_luong;
          sp.push(i);
          this.tinhTongTien();
        }
        localStorage.setItem("gio_hang", JSON.stringify(sp));
      }
    },
    async getDanhMuc() {
      let data = await api.get("danhmuc", { per_page: 9 });
      this.danhMucs = data.data.data;
    },
    PaginateSanPham(val) {
      this.page = val;
      this.getSanPham();
    },
    tinhTongTien() {
      this.tongTien = 0;
      for (let item of this.sanPhams) {
        this.tongTien =
          this.tongTien + Number(item.so_luong) * Number(item.gia_ban);
      }
      this.tongTien = this.tongTien - this.giamGia;
    },
    doiSoLuong(val) {

      this.tinhTongTien();
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
  },
};
</script>
<style scoped>
.danh-muc {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
}
.text-icon {
  font-size: 13px;
  font-weight: bold;
  padding-left: 15px;
}
.dat-hang {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
}
</style>