<template>
  <v-layout justify-center>
    <div class="page-width">
      <v-snackbar v-model="snackbar" :color="colorSnackbar">
        {{ noiDung }}
        <template v-slot:action="{ attrs }">
          <v-btn color="white" text v-bind="attrs" @click="snackbar = false">Đóng</v-btn>
        </template>
      </v-snackbar>
      <div
        class="ml-3"
        style="
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-top: 50px;
          border-bottom: solid 1px green;
        "
      >
        <div style="font-size: 20px; font-weight: bold;color: green;">GIỎ HÀNG</div>
        <nuxt-link to="/">
          <v-btn color="primary">
            <v-icon class="mr-2">mdi-shopping</v-icon>Tiếp tục mua sắm
          </v-btn>
        </nuxt-link>
      </div>
      <v-text-field color="success" loading disabled v-if="loadSanPham"></v-text-field>
      <v-card
        v-if="sanPhams.length > 0 && !loadSanPham"
        class="mb-3 pb-3 pr-3 mt-3"
        :elevation="20"
      >
        <v-card-title style="color: #145a32">Danh sách sản phẩm đặt mua</v-card-title>
        <v-card-subtitle>Giao hàng trong ngày</v-card-subtitle>
        <div
          class="pt-3 pr-3"
          style="
            display: flex;
            flex-direction: row-reverse;
            flex-wrap: wrap;
            overflow-y: auto;
            max-height: 450px;
          "
        >
          <div
            class="d-flex"
            style="height: 140px; width: 100%"
            v-for="sanPham in sanPhams"
            :key="sanPham.id"
          >
            <div style="width: 200px; height: 100%" class="ml-3">
              <v-img
                :src="
                  sanPham.anh_dai_dien
                    ? END_POINT_IMAGE + sanPham.anh_dai_dien
                    : product
                "
                aspect-ratio="1.7"
                style="max-width: 200px; max-height: 140px; border-radius: 15px"
              ></v-img>
            </div>
            <div style="height: 100%" class="flex-fill c-flex ml-6">
              <div class="d-flex" style="justify-content: space-between; flex-wrap: wrap">
                <div class="danh-muc">{{ sanPham.ten_san_pham }}</div>
                <div class="danh-muc mr-8">
                  {{ formatCurrency(sanPham.gia_ban) }} đ
                  <span
                    style="color: black; font-size: 14px; font-weight: normal"
                  >/{{ sanPham.don_vi_tinh }}</span>
                </div>
              </div>
              <div class="hide-text">
                Danh mục:
                {{ sanPham.danh_muc ? sanPham.danh_muc.ten_danh_muc : "" }}
              </div>
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
                style="
                  width: 80%;
                  border: 1px solid green;
                  padding-left: 10px;
                  border-radius: 5px;
                "
                label="Số lượng"
                :min="1"
                type="number"
                outlined
                dense
              />
            </div>
            <div
              style="
                width: 200px;
                height: 100%;
                display: flex;
                justify-content: flex-end;
              "
            >
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
        <div v-if="sanPhams.length > 0" class="mt-3">
          <div class="dat-hang ml-3">Giảm giá: {{ formatCurrency(giamGia) }} đ</div>
          <div class="dat-hang ml-3">
            Tổng thanh toán:
            <span
              style="color: green; font-size: 22px"
            >{{ formatCurrency(tongTien) }} đ</span>
          </div>
          <v-btn
            class="mt-3 ml-3"
            style="color: white"
            color="green"
            @click="showDatHang(true)"
          >MUA HÀNG</v-btn>
          <br />
        </div>
      </v-card>

      <v-card
        v-if="!loadSanPham && sanPhamDatHangs.length > 0"
        class="mb-3 pb-3 pr-3 mt-3"
        :elevation="20"
      >
        <v-card-title style="color: black">Danh sách sản phẩm đặt trước</v-card-title>
        <v-card-subtitle>(Giao hàng khi sản phẩm được nhập về)</v-card-subtitle>
        <div
          class="pt-3 pr-3"
          style="
            display: flex;
            flex-direction: row-reverse;
            flex-wrap: wrap;
            overflow-y: auto;
            max-height: 450px;
          "
        >
          <div
            class="d-flex"
            style="height: 140px; width: 100%"
            v-for="sanPham in sanPhamDatHangs"
            :key="sanPham.id"
          >
            <div style="width: 200px; height: 100%" class="ml-3">
              <v-img
                :src="
                  sanPham.anh_dai_dien
                    ? END_POINT_IMAGE + sanPham.anh_dai_dien
                    : product
                "
                aspect-ratio="1.7"
                style="max-width: 200px; max-height: 140px; border-radius: 15px"
              ></v-img>
            </div>
            <div style="height: 100%" class="flex-fill c-flex ml-6">
              <div class="d-flex" style="justify-content: space-between; flex-wrap: wrap">
                <div class="danh-muc">{{ sanPham.ten_san_pham }}</div>
                <div class="danh-muc mr-8">
                  {{ formatCurrency(sanPham.gia_ban) }} đ
                  <span
                    style="color: black; font-size: 14px; font-weight: normal"
                  >/{{ sanPham.don_vi_tinh }}</span>
                </div>
              </div>
              <div class="hide-text">
                Danh mục:
                {{ sanPham.danh_muc ? sanPham.danh_muc.ten_danh_muc : "" }}
              </div>
              <v-btn
                class="mx-2 mt-4 hide-text"
                x-small
                fab
                dark
                color="red"
                @click="xoaSanPhamDatHang(sanPham.id)"
              >
                <v-icon dark>mdi-delete</v-icon>
              </v-btn>
              <input
                class="delete-mobile"
                @change="doiSoLuong(sanPham.so_luong)"
                v-model="sanPham.so_luong"
                style="
                  width: 80%;
                  border: 1px solid green;
                  padding-left: 10px;
                  border-radius: 5px;
                "
                label="Số lượng"
                :min="1"
                type="number"
                outlined
                dense
              />
            </div>
            <div
              style="
                width: 200px;
                height: 100%;
                display: flex;
                justify-content: flex-end;
              "
            >
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
                @click="xoaSanPhamDatHang(sanPham.id)"
              >
                <v-icon dark>mdi-delete</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
        <div v-if="sanPhamDatHangs.length > 0" class="mt-3">
          <div
            style="font-size: 16px; font-style: normal"
            class="hide-text ml-3"
          >Giảm giá: {{ formatCurrency(giamGiaDathang) }} đ</div>
          <div class="dat-hang ml-3">
            Tổng thanh toán:
            <span
              style="color: #BF360C; font-size: 22px"
            >{{ formatCurrency(tongTienDatHang) }} đ</span>
          </div>
          <v-btn
            class="mt-3 ml-3"
            style="color: white"
            color="pink"
            @click="showDatHang(false)"
          >ĐẶT TRƯỚC</v-btn>
          <br />
        </div>
      </v-card>
      <div
        v-if="sanPhams.length <= 0 && sanPhamDatHangs.length <= 0"
        style="width: 100%; text-align: center"
      >
        <img class="mb-4" :src="emptyCard" height="350px" />
        <div class="mb-6">Không có sản phẩm nào trong giỏ hàng của bạn</div>
        <nuxt-link to="/">
          <v-btn color="primary">Tiếp tục mua sắm</v-btn>
        </nuxt-link>
      </div>
    </div>
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Thông tin đơn hàng</v-card-title>
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
          <v-text-field
            prepend-inner-icon="mdi-map-marker"
            class="mt-1"
            outlined
            dense
            v-model="form.dia_chi"
            placeholder="Địa chỉ nhận hàng"
            :rules="passwordRules"
          ></v-text-field>

          <label v-if="form.mua_hang" class="labelForm">Thời gian nhận hàng mong muốn</label>
          <v-text-field
            :rules="TimeRules"
            v-if="form.mua_hang"
            type="datetime-local"
            v-model="form.thoi_gian_nhan_hang"
          ></v-text-field>
          <label class="labelForm">Ghi chú</label>
          <v-text-field
            height="80"
            prepend-inner-icon="mdi-pen"
            class="mt-1"
            outlined
            dense
            v-model="form.ghi_chu"
            placeholder="Ghi chú đơn hàng"
          ></v-text-field>
          <label v-if="form.mua_hang" class="labelForm">Phương thức thanh toán</label>
          <v-select
            v-if="form.mua_hang"
            v-model="form.phuong_thuc_thanh_toan"
            dense
            :items="phuongThucThanhToan"
            label="Chọn phương thức thanh toán"
            item-text="ten"
            item-value="id"
            solo
            prepend-inner-icon="mdi-cash-usd"
          ></v-select>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialog = false">Hủy bỏ</v-btn>
          <v-btn v-if="form.mua_hang" color="green darken-1" text @click="datHang()">Mua hàng</v-btn>
          <v-btn v-else color="pink darken-1" text @click="datHang()">Đặt hàng</v-btn>
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
  head: () => ({
    title: "Giỏ Hàng",
  }),
  layout: "header",
  data: () => ({
    sanPhams: [],
    sanPhamDatHangs: [],
    danhMucs: [],
    emptyCard: emptyCard,
    END_POINT_IMAGE: END_POINT_IMAGE,
    tongTienDatHang: 0,
    giamGiaDathang: 0,
    colorSnackbar: "green",
    tongTien: 0,
    page: 1,
    per_page: 20,
    total_page: 1,
    giamGia: "",
    noiDung: "",
    snackbar: false,
    loadSanPham: true,
    phanTramGiamGia: 0,
    product: product,
    customerIcon: customerIcon,
    refershIcon: refershIcon,
    cartIcon: cartIcon,
    dialog: false,
    phuongThucThanhToan: [
      { id: "tai_khoan", ten: "Tài khoản" },
      { id: "tien_mat", ten: "Tiền mặt" },
    ],
    form: {
      ma: "DH" + new Date().getTime(),
      nguoi_mua_hang: "",
      so_dien_thoai: "",
      dia_chi: "",
      ghi_chu: "",
      mua_hang: true,
      phuong_thuc_thanh_toan: "cod",
      danhSachHang: [],
      datHang: [],
      thoi_gian_nhan_hang: new Date(),
    },
    passwordRules: [
      (v) => !!v || "Địa chỉ nhận hàng không thể bỏ trống",
      (v) => (v && v.length >= 6) || "Địa chỉ tối thiểu 6 ký tự",
    ],
    nameRules: [
      (v) => !!v || "Tên không thể bỏ trống",
      (v) => (v && v.length >= 2) || "Tên tối thiểu 2 ký tự",
    ],
    TimeRules: [(v) => new Date(v) > Date.now() || "Thời gian không hợp lệ"],
    phoneRules: [
      (v) => !!v || "Số điện thoại Không thể bỏ trống",
      (v) => (v && v.length == 10) || "Số điện thoại không hợp lệ",
    ],
  }),
  mounted() {
    this.getSanPham();
    this.getDanhMuc();
    this.getSanPhamDathang();
  },
  methods: {
    async getGiamGia(){
      try {
        let data = await api.get("thongtindathang");
        let gg = await api.get('chietkhaukhachhang/' +  data.data.data.tin_nhiem)
        this.phanTramGiamGia =  gg.data.phan_tram
      } catch (error) {
        this.phanTramGiamGia = 0
      }
    },
    async getInfo() {
      try {
        let data = await api.get("thongtindathang");
        this.form.nguoi_mua_hang = data.data.data.ten;
        this.form.so_dien_thoai = data.data.data.so_dien_thoai;
        this.form.dia_chi = data.data.data.dia_chi;
        this.form.giam_gia = this.giamGia;
        this.form.tong_tien = this.tongTien;
        this.form.datHang = this.sanPhamDatHangs;
        this.form.mua_hang = true;
        this.form.danhSachHang = this.sanPhams;
        this.form.phuong_thuc_thanh_toan = "tien_mat";
      } catch (error) {
        this.form = {
          ma: "DH" + new Date().getTime(),
          nguoi_mua_hang: "",
          so_dien_thoai: "",
          dia_chi: "",
          ghi_chu: "",
          danhSachHang: this.sanPhams,
          mua_hang: true,
          datHang: this.sanPhamDatHangs,
          giam_gia: this.giamGia,
          tong_tien: this.tongTien,
          phuong_thuc_thanh_toan: "cod",
        };
      }
    },
    async showDatHang(muaHang) {
      this.dialog = true;
      await this.getInfo();
      this.form.mua_hang = muaHang;
      if (!muaHang) {
        this.form.tong_tien = this.tongTienDatHang;
        this.form.giam_gia = this.giamGiaDathang;
      }
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
        if (!item.san_pham_ton_kho || !(item.san_pham_ton_kho.so_luong > 0)) {
          this.sanPhams.splice(this.sanPhams.indexOf(item), 1);
          this.sanPhamDatHangs.push(item);
        }
      }
      await this.getGiamGia()
      this.tinhTongTien();
      this.tinhTongTienDatHang();
      this.loadSanPham = false;
      this.form.danhSachHang = this.sanPhams;
      this.form.danhSachHang = this.sanPhamDatHangs;
    },

    async getSanPhamDathang() {
      this.loadSanPham = true;
      let product = JSON.parse(localStorage.getItem("dat_truoc"));
      if (!product) {
        this.loadSanPham = false;
        this.sanPhamDatHangs = [];
        return;
      }
      let san_pham_id = product.map((el) => Number(el.san_pham_id));
      let data = await api.get("sanphamgiohang", {
        san_pham_id: san_pham_id,
      });
      this.sanPhamDatHangs = data.data;
      for (let item of this.sanPhamDatHangs) {
        for (let i of product) {
          if (i.san_pham_id == item.id) {
            item["so_luong"] = i.so_luong;
          }
        }
        if (item.san_pham_ton_kho && item.san_pham_ton_kho.so_luong > 0) {
          this.sanPhamDatHangs.splice(this.sanPhamDatHangs.indexOf(item), 1);
          this.sanPhams.push(item);
        }
      }
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
    xoaSanPhamDatHang(id) {
      let index = this.sanPhamDatHangs.findIndex((el) => el.id == id);
      this.sanPhamDatHangs.splice(index, 1);
      if (this.sanPhamDatHangs.length == 0) {
        localStorage.removeItem("dat_truoc");
      } else {
        let sp = [];
        for (let item of this.sanPhamDatHangs) {
          let i = {};
          i.san_pham_id = item.id;
          i.so_luong = item.so_luong;
          sp.push(i);
          this.tinhTongTienDatHang();
        }
        localStorage.setItem("dat_truoc", JSON.stringify(sp));
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
      this.giamGia = Number(this.tongTien) * Number(this.phanTramGiamGia)/100
      this.tongTien = this.tongTien - this.giamGia;
    },  
    tinhTongTienDatHang() {
      this.tongTienDatHang = 0;
      for (let item of this.sanPhamDatHangs) {
        this.tongTienDatHang =
          this.tongTienDatHang + Number(item.so_luong) * Number(item.gia_ban);
      }
      this.giamGiaDathang = Number(this.tongTienDatHang) * Number(this.phanTramGiamGia)/100
      this.tongTienDatHang = this.tongTienDatHang - this.giamGiaDathang;
    },
    doiSoLuong(val) {
      this.tinhTongTien();
      this.tinhTongTienDatHang();
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
          console.log(this.form)
          let data = await api.post("khachdathang", this.form);
          this.colorSnackbar = "green";
          this.snackbar = true;
          this.noiDung = "Đặt hàng thành công";
          if (this.form.mua_hang) {
            localStorage.removeItem("gio_hang");
            this.$store.commit("giohang/add", 0);
            this.getSanPham();
          } else {
            localStorage.removeItem("dat_truoc");
            this.getSanPhamDathang();
          }
          this.dialog = false;
        } catch (error) {
          this.colorSnackbar = "pink";
          this.snackbar = true;
          this.noiDung = error.response.data.message;
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

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
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
  .tiep-tuc {
    display: none;
  }
}
</style>
