<template>
  <v-layout justify-center>
    <v-snackbar v-model="snackbar" color="green">
      {{ noiDung }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">Đóng</v-btn>
      </template>
    </v-snackbar>
    <div class="page-width">
      <div style class="all-product">TOÀN BỘ SẢN PHẨM</div>
      <v-progress-linear color="green darken-2" rounded value="100"></v-progress-linear>
      <v-text-field color="success" loading disabled v-if="loadSanPham"></v-text-field>
      <div
        style="margin-top: 50px; display: flex; flex-direction: row-reverse; flex-wrap: wrap;"
        v-else
        >
        <v-card
          class="mx-auto san-pham"
          v-for="(sanPham, index) in sanPhams"
          :key="index"
          style="margin-bottom: 40px"
        >
          <NuxtLink :to="'/sanpham/' + sanPham.id">
            <v-img
              :src=" sanPham.anh_dai_dien ? END_POINT_IMAGE + sanPham.anh_dai_dien : product"
              :lazy-src="product"
              width="100%"
              height="200"
            >
              <!-- <v-btn
                small
                color="pink"
                dark
                v-if="!sanPham.san_pham_ton_kho || !(sanPham.san_pham_ton_kho.so_luong > 0)"
              >Hết hàng</v-btn>
              <v-btn small color="success" dark v-else>Còn hàng</v-btn> -->
            </v-img>
          </NuxtLink>

          <v-card-title
            style="height: 95px; color: #145A32"
            class="ten-sanpham"
          >{{ sanPham.ten_san_pham }}</v-card-title>
          <v-card-subtitle class="d-flex align-center" style="justify-content: space-between">
            <span
              style="color: #764B09; font-size: 16px; font-weight: bold"
            >{{ formatCurrency(sanPham.gia_ban) }} đ</span>

            <v-btn
              v-if="sanPham.san_pham_ton_kho && sanPham.san_pham_ton_kho.so_luong > 0"
              color="green"
              class="mx-2 gio-hang"
              fab
              dark
              small
              @click="addGioHang(sanPham.id)"
            >
              <v-icon>mdi-cart</v-icon>
            </v-btn>
            <v-btn v-else color="#9E9E9E" class="mx-2 gio-hang" fab dark small>
              <v-icon>mdi-cart</v-icon>
            </v-btn>
            <v-btn
              icon
              @click="addSanPhamYeuThich(sanPham.id)"
              :style="{color: sanPham.daYeuThich ? 'red' : 'gray'}"
            >
              <v-icon>mdi-heart</v-icon>
            </v-btn>
          </v-card-subtitle>
          <!-- <v-card-actions class="mb-3">
            <v-btn class="ma-1 mt-0" outlined color="green">
              <v-icon left>mdi-cart</v-icon>THÊM VÀO GIỎ
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>-->
        </v-card>
      </div>
      <div class="text-center">
        <v-pagination
          v-model="page"
          :length="total_page"
          circle
          @input="PaginateSanPham"
          :total-visible="9"
        ></v-pagination>
      </div>
    </div>
  </v-layout>
</template>

<script>
import api from "@/api";
import { END_POINT_IMAGE } from "@/env";
import product from "@/assets/image/product.png";
export default {
  data: () => ({
    sanPhams: [],
    danhMucs: [],
    END_POINT_IMAGE: END_POINT_IMAGE,
    page: 1,
    per_page: 20,
    total_page: 1,
    loadSanPham: true,
    product: product,
    snackbar: false,
    noiDung: "",
    test: "green",
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
  mounted() {
    this.getSanPham();
  },
  methods: {
    async getSanPham() {
      let product = JSON.parse(localStorage.getItem("san_pham_yeu_thich"));
      this.loadSanPham = true;
      let data = await api.get("sanpham", {
        per_page: this.per_page,
        page: this.page,
      });
      this.sanPhams = data.data.data.data.map((e) => {
        e.daYeuThich = false;
        return e;
      });

      for (let item of this.sanPhams) {
        if (product && product.includes(item.id)) {
          item.daYeuThich = true;
        } else item.daYeuThich = false;
      }
      this.total_page = data.data.data.last_page;
      this.page = data.data.data.current_page;
      this.loadSanPham = false;
    },
    addGioHang(id) {
      let product = JSON.parse(localStorage.getItem("gio_hang"));
      if (!product) {
        product = [];
      }
      let sP = {};
      let check = product.find((el) => el.san_pham_id == id);
      if (check) {
        check.so_luong = check.so_luong + 1;
      } else {
        sP.so_luong = 1;
        sP.san_pham_id = id;
        product.push(sP);
      }

      let so_luong = 0;
      for (let item of product) {
        so_luong = Number(so_luong) + Number(item.so_luong);
      }
      this.snackbar = true;
      this.noiDung = "Đã thêm vào giỏ hàng";
      this.$store.commit("giohang/add", so_luong);
      localStorage.setItem("gio_hang", JSON.stringify(product));
    },
    addSanPhamYeuThich(id) {
      this.sanPhams.find((el) => el.id == id).daYeuThich = !this.sanPhams.find(
        (el) => el.id == id
      ).daYeuThich;
      console.log(this.sanPhams, id);
      let product = JSON.parse(localStorage.getItem("san_pham_yeu_thich"));
      if (!product) {
        product = [];
      }
      let sP = {};
      let check = product.findIndex((el) => el == id);
      if (check !== -1) {
        product.splice(check, 1);
      } else {
        product.push(id);
      }
      localStorage.setItem("san_pham_yeu_thich", JSON.stringify(product));
    },

    // checkSanPhamYeuThich(id) {
    //   console.log("dsa", id);
    //   let product = JSON.parse(localStorage.getItem("san_pham_yeu_thich"));
    //   if (!product) {
    //     product = [];
    //   }
    //   return product.includes(id);
    // },

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
  font-size: 13px;
  font-weight: bold;
  padding-left: 15px;
}
.all-product {
  margin-top: 50px;
  font-size: 22px;
  color: green;
}
.san-pham {
  width: 250px;
}
@media only screen and (max-width: 600px) {
  .khuyen-mai {
    display: none;
  }
  .text-icon {
    font-size: 10px;
  }
  .ten-sanpham {
    font-size: 14px;
  }
  .all-product {
    font-size: 24px;
    margin-left: 10px;
  }
  .san-pham {
    max-width: 170px;
  }
  .gio-hang {
    display: none;
  }
}
</style>
