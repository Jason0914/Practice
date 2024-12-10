$(document).ready(function () {
  // 展開/收縮按鈕邏輯
  $(".toggle-details").click(function (event) {
    event.stopPropagation(); // 防止觸發超連結跳轉

    const parent = $(this).closest(".list-group-item"); // 找到當前按鈕所在的父級
    const details = parent.find(".item-details"); // 找到詳細內容區域

    if (details.is(":visible")) {
      details.slideUp(); // 收起詳細內容
      $(this).text("展開"); // 修改按鈕文字
    } else {
      // 收起其他項目的詳細內容
      $(".item-details").slideUp();
      $(".toggle-details").text("展開");

      details.slideDown(); // 展開當前詳細內容
      $(this).text("收起"); // 修改按鈕文字
    }
  });
});

$(document).ready(function () {
  // 點擊圖片切換描述顯示/隱藏
  $(".meal-thumbnail").click(function () {
    const description = $(this).closest(".list-item").find(".meal-description");
    description.slideToggle(); // 顯示或隱藏描述區域
  });
});

$(document).ready(function () {
  // 初始化頁面加載時顯示分頁
  initializePagination("appetizer");

  // 獲取按鈕對應的分類
  $(".list-group-item").click(function () {
    var category = $(this).data("category");
  });

  // 當視窗大小改變時重新初始化分頁
  $(window).resize(function () {
    initializePagination();
  });

  // 定義全局變數，初始值為 localStorage 中的值或 null
  let orderData = JSON.parse(localStorage.getItem("orderData")) || {
    tableNumber: null,
    total: 0,
    orderTime: null,
    items: [],
  };

  // 監聽選擇框的變化事件
  $(".form-select").change(function () {
    orderData.tableNumber = $(this).val();
    saveOrderData();
  });

  // 渲染購物車
  function renderCart() {
    let cartItems = $("#cart-items"); // 選擇購物車項目容器
    cartItems.empty(); // 清空購物車容器的內容
    let totalPrice = 0; // 初始化總金額
    orderData.items.forEach((item, index) => {
      totalPrice += item.price * item.quantity; // 計算總金額
      cartItems.append(`
                <tr class="">
                    <td class="text-center py-2">${item.orderName}</td>
                    <td class="text-center py-2">${item.price}</td>
                    <td class="text-center py-2">
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <button class="btn btn-outline-secondary btn-sm change-quantity" data-index="${index}" data-action="decrease">-</button>
                            </div>
                            <input type="text" class="form-control text-center quantity-input" value="${
                              item.quantity
                            }" readonly>
                            <div class="input-group-append">
                                <button class="btn btn-outline-secondary btn-sm change-quantity" data-index="${index}" data-action="increase">+</button>
                            </div>
                        </div>
                    </td>
                    <td class="text-center py-2">NT$${
                      item.price * item.quantity
                    }</td>
                    <td class="text-center py-2"><button type="button" class="btn btn-outline-danger btn-sm remove-item" data-index="${index}">刪除</button></td>
                </tr>
            `);
    });
    $("#total-amount").text(`總金額: NT$${totalPrice}`); // 更新總金額顯示
    $("#table-number").text(`桌號: ${orderData.tableNumber}`); // 更新桌號顯示
    orderData.totalPrice = totalPrice; // 更新總金額
    saveOrderData(); // 保存訂單資料
  }

  // 將訂單資料儲存到 localStorage
  function saveOrderData() {
    localStorage.setItem("orderData", JSON.stringify(orderData));
  }

  // 將項目添加到購物車
  function addToCart(item) {
    let existingItem = orderData.items.find(
      (cartItem) => cartItem.orderName === item.orderName
    );
    if (existingItem) {
      existingItem.quantity++; // 如果存在，增加其數量
    } else {
      orderData.items.push({ ...item, quantity: 1 }); // 如果不存在，將其添加到購物車中
    }

    Swal.fire({
      position: "center",
      icon: "success",
      iconColor: "#4CAF50",
      background: "rgb(0,0,0)", // 背景顏色
      color: "#4CAF50", // 文字顏色
      title: `${item.orderName}已加入購物車`,
      showConfirmButton: false,
      timer: 1000,
    });

    renderCart(); // 渲染更新後的購物車
  }

  // 點擊添加到購物車按鈕時將餐點添加到購物車
  $("#meal-container").on("click", ".add-to-cart", function () {
    let orderName = $(this).data("name"); // 獲取餐點名稱
    let price = $(this).data("price"); // 獲取餐點價格
    if (orderName && price) {
      // 檢查名稱和價格是否有效
      addToCart({ orderName, price }); // 添加到購物車
    }
  });

  // 點擊刪除按鈕時從購物車中移除對應項目
  $("#cart-items").on("click", ".remove-item", function () {
    let index = $(this).data("index"); // 獲取項目索引
    var itemName = $(this).closest("tr").find("td").eq(0).text().trim(); // 獲取當前按鈕所在的行，並直接取第一個單元格的內容

    Swal.fire({
      title: "確定要刪除嗎?",
      text: "此操作無法恢復！",
      icon: "warning",
      showCancelButton: true,
      background: "rgb(0,0,0)", // 背景顏色
      color: "#4CAF50", // 文字顏色
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "刪除",
      cancelButtonText: "取消",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: `${itemName}刪除成功!`,
          icon: "success",
          iconColor: "#4CAF50",
          background: "rgb(0,0,0)", // 背景顏色
          color: "#4CAF50", // 文字顏色
          timer: 1000,
          showConfirmButton: false,
        });

        orderData.items.splice(index, 1); // 刪除對應項目
        renderCart(); // 渲染更新後的購物車
      }
    });
  });

  // 點擊增加或減少數量按鈕時更新對應項目的數量
  $("#cart-items").on("click", ".change-quantity", function () {
    let index = $(this).data("index"); // 獲取項目索引
    let action = $(this).data("action"); // 獲取操作類型（增加或減少）

    if (action === "increase") {
      orderData.items[index].quantity++; // 增加數量
    } else if (action === "decrease") {
      if (orderData.items[index].quantity > 1) {
        orderData.items[index].quantity--; // 減少數量
      }
    }

    renderCart(); // 渲染更新後的購物車
  });

  // 點擊送出訂單按鈕時，使用 AJAX 將購物車資料發送到後端
  $("#submit-order").on("click", function (event) {
    event.preventDefault(); // 阻止表單的默認提交行為

    // 獲取選擇的桌號
    var tableNumber = $(".form-select").val();
    if (!tableNumber) {
      Swal.fire({
        icon: "error",
        iconColor: "#4CAF50",
        background: "rgb(0,0,0)", // 背景顏色
        color: "#4CAF50", // 文字顏色
        title: "請選擇桌號！",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    if (orderData.items.length === 0) {
      Swal.fire({
        icon: "error",
        iconColor: "#4CAF50",
        background: "rgb(0,0,0)", // 背景顏色
        color: "#4CAF50", // 文字顏色
        title: "購物車是空的，無法結帳！",
        timer: 1500,
        showConfirmButton: false,
      });
      return;
    }

    // 更新桌號
    orderData.tableNumber = tableNumber;

    // 更新訂單時間
    orderData.orderTime = new Date()
      .toISOString()
      .replace("T", " ")
      .substring(0, 19); // 新增訂單時間，格式為 "yyyy-MM-dd HH:mm:ss"

    /*
        // 獲取當前時間
        var currentDate = new Date();
    	
        // 格式化輸出
        orderData.orderTime = currentDate.getFullYear() + '-' +
            ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' +
            ('0' + currentDate.getDate()).slice(-2) + ' ' +
            ('0' + currentDate.getHours()).slice(-2) + ':' +
            ('0' + currentDate.getMinutes()).slice(-2) + ':' +
            ('0' + currentDate.getSeconds()).slice(-2);
         */

    // 使用 AJAX 發送資料到後端
    $.ajax({
      url: "http://localhost:8082/order_backend/", // 替換為你的後端提交訂單的 URL
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(orderData),
      success: function (response) {
        Swal.fire({
          icon: "success",
          iconColor: "#4CAF50",
          background: "rgb(0,0,0)", // 背景顏色
          color: "#4CAF50", // 文字顏色,
          title: "訂單已送出！",
          timer: 1500,
          showConfirmButton: false,
        });

        if (response.redirectUrl) {
          window.location.href = response.redirectUrl;
        } else {
          orderData = {
            // 重置訂單資料
            tableNumber: null,
            total: 0,
            orderTime: null,
            items: [],
          };
          $(".form-select").val(null).prop("selectedIndex", 0);
          renderCart(); // 渲染空的購物車
        }
      },
      error: function (xhr, status, error) {
        Swal.fire({
          icon: "error",
          iconColor: "#4CAF50",
          background: "rgb(0,0,0)", // 背景顏色
          color: "#4CAF50", // 文字顏色
          title: "送出訂單失敗，請稍後再試",
          timer: 1500,
          showConfirmButton: false,
        });
      },
    });
  });

  renderCart(); // 在頁面載入時渲染購物車

  $(document).ready(function () {
    // 桌號查詢功能
    window.fetchTableData = function fetchTableData() {
      const tableNumber = $("#tableNumber").val();
      if (!tableNumber) {
        Swal.fire("請選擇桌號", "", "warning");
        return;
      }
      $.get(`/orders/table/${tableNumber}`, function (data) {
        const tableBody = $("#orderTable tbody");
        tableBody.empty();
        if (data.length === 0) {
          Swal.fire("此桌號無訂單資料", "", "info");
          return;
        }
        data.forEach((order) => {
          const row = `
	                    <tr>
	                        <td>${order.orderId}</td>
	                        <td>${order.tableNumber}</td>
	                        <td>${formatDate(order.orderTime)}</td>
	                        <td>${order.totalPrice}元</td>
	                        <td>
	                            <button class="btn btn-success btn-sm" onclick="viewDetails(${
                                order.orderId
                              })">明細</button>
	                            <button class="btn btn-danger btn-sm" onclick="deleteOrder(${
                                order.orderId
                              })">刪除</button>
	                        </td>
	                    </tr>`;
          tableBody.append(row);
        });
        initializePagination();
      }).fail(() => {
        Swal.fire("查詢失敗，請稍後再試", "", "error");
      });
    };

    // 查看訂單明細
    window.viewDetails = function (orderId) {
      fetch(`/table/orders/details/${orderId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("訂單明細未找到");
          }
          return response.json();
        })
        .then((data) => {
          if (!data.order || !Array.isArray(data.items)) {
            throw new Error("返回數據不完整");
          }

          $("#detailOrderId").text(data.order.orderId);
          $("#detailTableNumber").text(data.order.tableNumber);

          const detailsTableBody = $("#orderDetailsTableBody");
          detailsTableBody.empty();

          data.items.forEach((item) => {
            detailsTableBody.append(`
		                    <tr>
		                        <td>${item.orderName}</td>
		                        <td>${item.quantity}</td>
		                        <td>${item.price}元</td>
		                        <td>${item.quantity * item.price}元</td>
		                    </tr>`);
          });

          $("#detailTotalPrice").text(`${data.order.totalPrice}元`);

          const modal = new bootstrap.Modal($("#orderDetailsModal")[0]);
          modal.show();
        })
        .catch((error) => {
          console.error("獲取訂單明細失敗：", error);
          Swal.fire("無法獲取訂單明細", error.message, "error");
        });
    };

    // 刪除訂單
    window.deleteOrder = function (orderId) {
      Swal.fire({
        title: "確定刪除訂單？",
        icon: "warning",
        iconColor: "#4CAF50",
        background: "rgb(0,0,0)", // 背景顏色
        color: "#4CAF50", // 文字顏色
        showCancelButton: true,
        confirmButtonText: "刪除",
        cancelButtonText: "取消",
      }).then((result) => {
        if (result.isConfirmed) {
          fetch(`/table/orders/delete/${orderId}`, { method: "DELETE" })
            .then((response) => {
              if (!response.ok) {
                throw new Error("刪除失敗");
              }
              Swal.fire("訂單已刪除", "", "success");
              fetchTableData(); // 刷新 table.jsp 的表格
            })
            .catch((error) => {
              console.error("刪除失敗：", error);
              Swal.fire("刪除失敗，請稍後再試", "", "error");
            });
        }
      });
    };

    // 日期格式化
    function formatDate(dateTime) {
      const date = new Date(dateTime);
      return date.toLocaleString("zh-TW", { hour12: false });
    }

    // 獲取每頁顯示的數量
    function getPerPage() {
      if (window.innerWidth < 767) {
        return 4;
      } else if (window.innerWidth < 992) {
        return 6;
      } else {
        return 9;
      }
    }
  });

  // 分頁功能
  function initializePagination() {
    const rows = $("#orderTable tbody tr");
    const perPage = 5;
    rows.hide().slice(0, perPage).show();
    $("#pagination-container").pagination({
      items: rows.length,
      itemsOnPage: perPage,
      onPageClick: function (pageNumber) {
        const start = perPage * (pageNumber - 1);
        const end = start + perPage;
        rows.hide().slice(start, end).show();
      },
      prevText: "<<", // 將 Prev 改成 <<
      nextText: ">>", // 將 Next 改成 >>
    });
  }
});
