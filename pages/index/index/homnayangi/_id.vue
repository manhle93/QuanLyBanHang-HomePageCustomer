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
          ></v-img>
        </div>
        <div class="c-flex flex-fill thongtin-sanpham" style="height: 400px; max-width: 90%">
          <div
            style="font-size: 24px; font-weight: light; margin-bottom: 10px;color: #039a1f"
          >{{sanPham.ten ? sanPham.ten.toUpperCase() : ''}}</div>
          <div class="c-flex khung-thuoctinh">
            <div style="color: #f36523; font-size: 20px; font-weight: 500">
              Dành cho {{formatCurrency(sanPham.so_nguoi_an)}}
              <span
                style="color: #f36523; font-size: 20px;"
              >Người</span>
            </div>
            <div class="thuoc-tinh" style="margin-top: 24px">
              <p style="font-weight: bold">Mô tả:</p>
              <div style="font-size: 20px;">{{sanPham.mo_ta}}</div>
            </div>
          </div>
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
      <div v-if="nguyenLieu.length">
        <div class="ml-3 d-flex" style="font-size: 20px; font-weight: bold; margin-top: 20px">
          <div>Nguyên liệu chế biến</div>
          <div style="margin-left: 20px;">
            <v-text-field
              v-model="nguoi_an"
              type="number"
              hide-details
              label="Số lượng người ăn"
              @change="soNguoiAn()"
              outlined
              dense
            ></v-text-field>
          </div>
        </div>
        <br />
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th style="font-size: 16px">STT</th>
                <th style="font-size: 16px">Nguyên liệu</th>
                <th style="font-size: 16px">Số lượng định mức</th>
                <th style="font-size: 16px; width: 250px">Số lượng mua</th>
                <th style="font-size: 16px">Đơn giá</th>
                <th style="font-size: 16px">Thành tiền</th>
                <th style="font-size: 16px">Đặt mua</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in nguyenLieu" :key="item.nguyen_lieu_id">
                <td>{{ index + 1}}</td>
                <td>{{ item.ten }}</td>
                <td>{{ item.so_luong +' '+ item.don_vi}}</td>
                <td>
                  <v-text-field
                    type="number"
                    v-model="item.so_luong_mua"
                    hide-details
                    dense
                    style="width: 80%"
                    label="Số lượng"
                    outlined
                  ></v-text-field>
                </td>
                <td>{{ formatCurrency(item.gia_ban) }} đ</td>
                <td>{{ formatCurrency((item.gia_ban * item.so_luong_mua)) }} đ</td>

                <td>
                  <div v-if="!item.kinh_doanh">
                    <v-btn class="ma-2" outlined color="indigo">Không kinh doanh</v-btn>
                  </div>
                  <div v-else>
                    <v-tooltip top v-if="(!item.ton_kho || !(item.ton_kho > 0))">
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          tile
                          color="pink"
                          small
                          v-bind="attrs"
                          v-on="on"
                          dark
                          @click="datTruocNguyenLieu(item)"
                        >
                          <v-icon left>mdi-cart</v-icon>Đặt trước
                        </v-btn>
                      </template>
                      <span>Nguyên liệu hết hàng. Nhấn để đặt trước</span>
                    </v-tooltip>
                    <v-tooltip top v-else>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          tile
                          color="success"
                          small
                          v-bind="attrs"
                          v-on="on"
                          @click="muaNguyenLieu(item)"
                        >
                          <v-icon left>mdi-cart</v-icon>Mua hàng
                        </v-btn>
                      </template>
                      <span>Thêm vào giỏ hàng</span>
                    </v-tooltip>
                  </div>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <div
          class="ml-3"
          style="font-size: 20px; font-weight: bold; margin-top: 20px"
        >Sản phẩm liên quan</div>
        <div style="margin-top: 50px; display: flex; flex-direction: row-reverse; flex-wrap: wrap;">
          <v-card
            class="mx-auto san-pham"
            v-for="(sanPham, index) in nguyenLieu"
            :key="index"
            style="margin-bottom: 40px;"
          >
            <NuxtLink :to="'/sanpham/' + sanPham.nguyen_lieu_id">
              <v-img
                :src="sanPham.hinh_anh ? END_POINT_IMAGE + sanPham.hinh_anh : product"
                :lazy-src="sanPham.hinh_anh ? END_POINT_IMAGE + sanPham.hinh_anh : product"
                width="100%"
                height="200"
              ></v-img>
            </NuxtLink>

            <v-card-title
              style="height: 95px; color: black;font-size: 16px;font-weight: normal"
              class="ten-sanpham"
            >{{ sanPham.ten }}</v-card-title>
            <v-card-subtitle class="d-flex align-center" style="justify-content: space-between">
              <span
                style="color: #764B09; font-size: 16px; font-weight: bold"
              >{{ formatCurrency(sanPham.gia_ban) }} đ</span>
              <span style="color: black; font-size: 14px; font-weight: normal">/{{sanPham.don_vi}}</span>
              <v-btn
                v-if="sanPham.ton_kho"
                color="green"
                class="mx-2 gio-hang"
                fab
                dark
                small
                @click="muaNguyenLieu(sanPham)"
              >
                <v-icon>mdi-cart</v-icon>
              </v-btn>
              <v-btn
                v-else
                color="pink"
                class="mx-2 gio-hang"
                fab
                dark
                small
                @click="datTruocNguyenLieu(sanPham)"
              >
                <v-icon>mdi-cart</v-icon>
              </v-btn>
            </v-card-subtitle>
          </v-card>
        </div>
      </div>
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
    END_POINT_IMAGE: END_POINT_IMAGE,
    sanPham: {
      ten_san_pham: "",
      gia_ban: "",
      danh_muc: {
        ten_danh_muc: "",
      },
      hinh_anhs: [],
    },
    nguoi_an: 0,
    nguyenLieu: [],
    nguyenLieuOld: [],
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
      let data = await api.get("trangchuhomnayangi/" + this.$route.params.id);
      this.loadSanPham = false;
      this.sanPham = data.data.san_pham;
      this.nguoi_an = this.sanPham.so_nguoi_an;
      let nguyenLieu = data.data.nguyen_lieu;
      
      nguyenLieu.map((el) => (el.so_luong_mua = el.so_luong));
      this.nguyenLieu = nguyenLieu
      this.nguyenLieuOld = [...this.nguyenLieu];

    },
    async getDanhMuc() {
      let data = await api.get("danhmuc", { per_page: 9 });
      this.danhMucs = data.data.data;
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
    soNguoiAn() {
      let n = this.nguoi_an / this.sanPham.so_nguoi_an;
      n = Math.round(n * 100 + Number.EPSILON) / 100;
      this.nguyenLieu = this.nguyenLieuOld.map((el) => ({
        ...el,
        so_luong: Math.round(+el.so_luong * n * 100 + Number.EPSILON) / 100,
        so_luong_mua:
         Math.round(+el.so_luong * n * 100 + Number.EPSILON) / 100,
      }));
    },
    datTruocNguyenLieu(data) {
      let product = JSON.parse(localStorage.getItem("dat_truoc"));
      if (!product) {
        product = [];
      }
      let sP = {};

      let check = product.find((el) => el.san_pham_id == data.nguyen_lieu_id);
      if (check) {
        check.so_luong = Number(check.so_luong) + Number(data.so_luong_mua);
      } else {
        sP.so_luong = data.so_luong_mua;
        sP.san_pham_id = data.nguyen_lieu_id;
        product.push(sP);
      }

      let so_luong = 0;
      for (let item of product) {
        so_luong = Number(so_luong) + Number(item.so_luong);
      }
      localStorage.setItem("dat_truoc", JSON.stringify(product));
      this.snackbar = true;
      this.noiDung = "Đã thêm vào giỏ hàng";
    },
    muaNguyenLieu(data) {
      let product = JSON.parse(localStorage.getItem("gio_hang"));
      if (!product) {
        product = [];
      }
      let sP = {};

      let check = product.find((el) => el.san_pham_id == data.nguyen_lieu_id);
      if (check) {
        check.so_luong = Number(check.so_luong) + Number(data.so_luong_mua);
      } else {
        sP.so_luong = Number(data.so_luong_mua);
        sP.san_pham_id = data.nguyen_lieu_id;
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
.san-pham {
  width: 250px;
}
.co-hang {
  font-size: 14px;
  font-style: italic;
  color: #f36523;
  margin-bottom: 10px;
}
.text-icon {
  font-size: 16px;
  font-weight: bold;
  padding-left: 15px;
}
.thuoc-tinh {
  font-size: 17px;
  margin-bottom: 10px;
  /* font-weight: bold; */
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