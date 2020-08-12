<template>
  <v-layout justify-center>
    <div class="page-width">
      <v-snackbar v-model="snackbar" color="green">
        {{ noiDung }}
        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">Đóng</v-btn>
        </template>
      </v-snackbar>
      <div style="margin-top: 50px; font-size: 26px; font-weight: bold" class="ml-3">GIỎ HÀNG</div>
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
          <div style="width: 200px; height: 100%;" class="ml-3">
            <v-img
              :src="sanPham.anh_dai_dien ? END_POINT_IMAGE +sanPham.anh_dai_dien : product"
              aspect-ratio="1.7"
              style="max-width: 200px; max-height: 140px; border-radius: 15px"
            ></v-img>
          </div>
          <div style="height: 100%" class="flex-fill c-flex ml-6">
            <div class="d-flex" style="justify-content: space-between; flex-wrap: wrap">
              <div class="danh-muc">{{sanPham.ten_san_pham}}</div>
              <div class="danh-muc mr-8">{{formatCurrency(sanPham.gia_ban)}} đ</div>
            </div>
            <div
              class="hide-text"
            >Danh mục: {{sanPham.danh_muc ? sanPham.danh_muc.ten_danh_muc : ""}}</div>
            <v-btn
              class="mx-2 mt-4 hide-text"
              x-small
              fab
              dark
              color="pink"
              @click="xoaSanPham(sanPham.id)"
            >
              <v-icon dark>mdi-delete</v-icon>
            </v-btn>
            <input
              class="delete-mobile"
              @change="doiSoLuong(sanPham.so_luong)"
              v-model="sanPham.so_luong"
              style="width: 80%; border: 1px solid green; padding-left: 10px; border-radius: 5px"
              label="Số lượng"
              :min="1"
              type="number"
              outlined
              dense
            />
          </div>
          <div style="width: 200px; height: 100%; display: flex; justify-content: flex-end">
            <v-text-field
              class="hide-text"
              @change="doiSoLuong(sanPham.so_luong)"
              v-model="sanPham.so_luong"
              style="width: 80%"
              label="Số lượng"
              :min="1"
              type="number"
              outlined
              dense
            ></v-text-field>
            <v-btn
              class="delete-mobile mr-4"
              x-small
              fab
              dark
              color="pink"
              @click="xoaSanPham(sanPham.id)"
            >
              <v-icon dark>mdi-delete</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
      <div v-if="sanPhams.length > 0">
        <div class="d-flex ml-3">
          <div style="width: 300px">
            <v-text-field
              v-model="giamGia"
              style="max-width: 300px"
              label="Mã giảm giá"
              outlined
              dense
            ></v-text-field>
          </div>
          <v-btn class="ml-4 mr-3" color="primary">Áp dụng</v-btn>
        </div>
        <div class="dat-hang ml-3">Giảm giá: {{formatCurrency(giamGia)}} đ</div>
        <div class="dat-hang ml-3">
          Tổng thanh toán:
          <span style="color: green; font-size: 22px">{{formatCurrency(tongTien)}} đ</span>
        </div>
        <v-btn class="mt-3 ml-3" style="color: white" color="green" @click="showDatHang()">ĐẶT HÀNG</v-btn>
      </div>
      <div v-else style="width: 100%; text-align: center;">
        <img class="mb-4" :src="emptyCard" height="350px" />
        <div class="mb-6">Không có sản phẩm nào trong giỏ hàng của bạn</div>
        <nuxt-link to="/">
          <v-btn color="primary">Tiếp tục mua sắm</v-btn>
        </nuxt-link>
      </div>
    </div>
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Thông tin đặt hàng</v-card-title>
        <v-form ref="form" class="pl-4 pr-4">
          <label class="labelForm">Họ tên</label>
          <v-text-field
            prepend-inner-icon="mdi-account"
            class="mt-1"
            name="ten"
            outlined
            dense
            type="E-Mail"
            v-model="form.nguoi_mua_hang"
            placeholder="Người mua hàng"
            :rules="nameRules"
          ></v-text-field>
          <label class="labelForm">Số điện thoại</label>
          <v-text-field
            prepend-inner-icon="mdi-phone"
            class="mt-1"
            name="so_dien_thoai"
            outlined
            dense
            type="E-Mail"
            v-model="form.so_dien_thoai"
            placeholder="Nhập số điện thoại"
            :rules="phoneRules"
          ></v-text-field>
          <label class="labelForm">Địa chỉ nhận hàng</label>
          <v-textarea
            height="80"
            prepend-inner-icon="mdi-map-marker"
            class="mt-1"
            outlined
            dense
            v-model="form.dia_chi"
            placeholder="Địa chỉ nhận hàng"
            :rules="passwordRules"
          ></v-textarea>

          <label class="labelForm">Ghi chú</label>
          <v-textarea
            height="80"
            prepend-inner-icon="mdi-pen"
            class="mt-1"
            outlined
            dense
            v-model="form.ghi_chu"
            placeholder="Ghi chú đơn hàng"
          ></v-textarea>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">Hủy bỏ</v-btn>
          <v-btn color="green darken-1" text @click="datHang()">Đặt hàng</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    dialog: false,
    form: {
      ma: 'DH' + (new Date).getTime(),
      nguoi_mua_hang: "",
      so_dien_thoai: "",
      dia_chi: "",
      ghi_chu: "",
      danhSachHang: []
    },
    passwordRules: [
      (v) => !!v || "Địa chỉ nhận hàng không thể bỏ trống",
      (v) => (v && v.length >= 6) || "Địa chỉ tối thiểu 6 ký tự",
    ],
    nameRules: [
      (v) => !!v || "Tên không thể bỏ trống",
      (v) => (v && v.length >= 2) || "Tên tối thiểu 2 ký tự",
    ],
    phoneRules: [
      (v) => !!v || "Số điện thoại Không thể bỏ trống",
      (v) => (v && v.length == 10) || "Số điện thoại không hợp lệ",
    ],
  }),
  mounted() {
    this.getSanPham();
    this.getDanhMuc();
  },
  methods: {
    async getInfo() {
      try {
        let data = await api.get("thongtindathang");
        this.form.nguoi_mua_hang = data.data.data.ten;
        this.form.so_dien_thoai = data.data.data.so_dien_thoai;
        this.form.dia_chi = data.data.data.dia_chi;
        this.form.giam_gia = this.giamGia
        this.form.tong_tien = this.tongTien
      } catch (error) {
        this.form = {
          ma: 'DH' + (new Date).getTime(),
          nguoi_mua_hang: "",
          so_dien_thoai: "",
          dia_chi: "",
          ghi_chu: "",
          danhSachHang: this.sanPhams,
          giam_gia: this.giamGia,
          tong_tien: this.tongTien
        };
      }
    },
    showDatHang(){
      this.dialog = true
      this.getInfo()
    },
    validate() {
      this.$refs.form.validate();
    },
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
      this.form.danhSachHang = this.sanPhams
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

    async datHang() {
      if (this.$refs.form.validate()) {
        try {
          let data = await api.post('khachdathang', this.form);
          this.snackbar = true
          this.noiDung = "Đặt hàng thành công"
          localStorage.removeItem('gio_hang')
          this.dialog = false
          this.getSanPham()
          this.$store.commit("giohang/add", 0);
        } catch (error) {
          console.log(error);
        }
      } else {
        return console.log("Lỗi validate ", this.$refs.form);
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
.delete-mobile {
  display: none;
}
@media only screen and (max-width: 600px) {
  .danh-muc {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 4px;
  }
  .hide-text {
    display: none;
  }
  .delete-mobile {
    display: inline;
  }
}
</style>