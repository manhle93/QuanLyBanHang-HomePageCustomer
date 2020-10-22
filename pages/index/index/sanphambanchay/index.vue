<template>
  <v-layout justify-center>
    <div class="page-width">
      <div style="border-bottom: solid 1px green;" class="all-product">SẢN PHẨM BÁN CHẠY</div>
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
              :src=" sanPham.san_pham.anh_dai_dien ? END_POINT_IMAGE + sanPham.san_pham.anh_dai_dien : product"
              :lazy-src="product"
              width="100%"
              height="200"
            >
              <!-- <v-btn
                small
                color="pink"
                dark
                v-if="!sanPham.san_pham.san_pham_ton_kho || !(sanPham.san_pham.san_pham_ton_kho.so_luong > 0)"
              >Hết hàng</v-btn>
              <v-btn small color="success" dark v-else>Còn hàng</v-btn> -->
            </v-img>
          </NuxtLink>

          <v-card-title
            style="height: 95px; color: #145A32"
            class="ten-sanpham"
          >{{ sanPham.san_pham.ten_san_pham }}</v-card-title>
          <v-card-subtitle class="d-flex align-center" style="justify-content: space-between">
            <span
              style="color: #764B09; font-size: 16px; font-weight: bold"
            >{{ formatCurrency(sanPham.san_pham.gia_ban) }} đ</span>

            <v-btn
              v-if="sanPham.san_pham.san_pham_ton_kho && sanPham.san_pham.san_pham_ton_kho.so_luong > 0"
              color="green"
              class="mx-2 gio-hang"
              fab
              dark
              small
              @click="addGioHang(sanPham.san_pham_id)"
            >
              <v-icon>mdi-cart</v-icon>
            </v-btn>
            <v-btn v-else color="#9E9E9E" class="mx-2 gio-hang" fab dark small>
              <v-icon>mdi-cart</v-icon>
            </v-btn>
            <v-btn
              icon
              @click="addSanPhamYeuThich(sanPham.san_pham_id)"
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
    </div>
  </v-layout>
</template>

<script>
import api from "@/api";
import { END_POINT_IMAGE } from "@/env";
import product from "@/assets/image/product.png";
export default {
  data: () => ({
    sanPhams: [{ danh_muc: { ten_danh_muc: "Danh mục" } }],
    danhMucs: [],
    tenDanhMuc: "",
    END_POINT_IMAGE: END_POINT_IMAGE,
    page: 1,
    per_page: 20,
    total_page: 1,
    loadSanPham: true,
    product: product,
  }),
  watch: {},
  mounted() {
    this.getSanPham();
  },
  methods: {
    async getSanPham() {
      let product = JSON.parse(localStorage.getItem("san_pham_yeu_thich"));
      this.loadSanPham = true;
      let data = await api.get("sanphambanchaytrangchu", {});
      this.sanPhams = data.data.map((e) => {
        e.daYeuThich = false;
        return e;
      });
      for (let item of this.sanPhams) {
        if (product && product.includes(item.san_pham_id)) {
          item.daYeuThich = true;
        } else item.daYeuThich = false;
      }
      this.loadSanPham = false;
    },
    addSanPhamYeuThich(id) {
      this.sanPhams.find((el) => el.san_pham_id == id).daYeuThich = !this.sanPhams.find(
        (el) => el.san_pham_id == id
      ).daYeuThich;
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
  font-size: 16px;
  font-weight: bold;
  padding-left: 15px;
}
.san-pham {
  width: 250px;
}
.all-product {
  margin-top: 40px;
  font-size: 20px;
  /* font-weight: bold; */
  color: green;
}
@media only screen and (max-width: 600px) {
  .san-pham {
    max-width: 170px;
  }
  .all-product {
    font-size: 24px;
    margin-left: 10px;
  }
}
</style>
