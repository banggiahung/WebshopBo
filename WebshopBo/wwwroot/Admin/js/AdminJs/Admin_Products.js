var Product_vue = new Vue({
    el: '#Product_vue',
    data: {
        dataItems: [],
        dataSubItems: [],

        ProductName: "",
        quantity: 0,
        CategoryID: 0,
        Price: 0,
        PriceDiscount: 0,
        Slug: "",
        Description: "",
        ShortDescription: "",

        ckName: "",

        imageFile: null,
        previewImage: null,
        uploadedImage: null,

        imageFile1: null,
        previewImage1: null,
        uploadedImage1: null,

        imageProducts: "",
        detailsCkName: "",
        editorInstance: false,
        editor: null,
    },
    computed: {
       

    },
    created() {
        EventBus.$on('listUrlReceived', data => {
            this.listUrl = data;
        });

    },
    watch: {
       
       
    },
    beforeDestroy() {
        if (this.editor) {
            this.editor.destroy();
        }
    },
    mounted() {
        $('#preloader').fadeIn();
        this.loadSubItems();
       
        axios.get("/Categories/GetAllCategories")
           .then((response) => {
              this.dataSubItems = response.data;
            });
      

    },
    methods: {
        clickButton() {
            this.checkButton = !this.checkButton;
        },
        onFileChangeVideo(event) {
            const selectedVideo = event.target.files[0];
            if (selectedVideo) {
                this.previewVideo = URL.createObjectURL(selectedVideo);
            } else {
                this.previewVideo = null;
            }
        },
        loadSubCategories() {
            this.dataSubItems = this.filteredSubCategories.filter(item => item.categoryID === this.CategoryID);
        },
        loadWhenEdit() {
            this.filteredSubCategories = this.filteredSubCategoriesEdit.filter(item => item.categoryID === this.CateEditID);

        },
        mapDataSubItems(subCateID) {
            const foundItem = this.filteredSubCategories.find(item => item.id === subCateID);

            if (foundItem) {
                this.SubCategoryID = foundItem.id;
            }
        },
        toggleTables() {
            this.showTable1 = !this.showTable1;
            if (!this.showTable1) {

                $('#product_table').DataTable().destroy();

            } else {
                this.loadSubItems();

            }
        },
        AddToSitemap(url) {
            try {
                const formData = new FormData();
                formData.append('url', url);
                axios.post('/WebConfig/AddToSitemap', formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Đã lưu thành công',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();

                    }
                });
            }
            catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Đã có lỗi xảy ra',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            }
           
        },
        loadSubItems() {
            configureCKEditor('#editor', this, this.ckName);
            this.editorInstance = true;
            let currentPage = 0;
            if ($.fn.DataTable.isDataTable('#table_products')) {
                currentPage = $('#table_products').DataTable().page();
                $('#table_products').DataTable().destroy();
            }

            axios.get("/Products/GetAllProducts")
                .then((response) => {
                    this.dataItems = response.data;
                   
                    $('#preloader').fadeOut();

                    return Promise.resolve();
                })
                .then(() => {
                    const table = $("#table_products").DataTable({
                        deferRender: true,

                        ...this.$globalConfig.createDataTableConfig(),
                        'columnDefs': [{
                            'targets': [-1],
                            'orderable': false,
                        }],
                        searching: true,
                        iDisplayLength: 7,
                        "ordering": false,
                        lengthChange: false,
                        aaSorting: [[0, "desc"]],
                        aLengthMenu: [
                            [5, 10, 25, 50, 100, -1],

                            ["5 dòng", "10 dòng", "25 dòng", "50 dòng", "100 dòng", "Tất cả"],
                        ]

                    });
                    if (currentPage !== 0) {
                        table.page(currentPage).draw('page');
                    }
                });
        },
        generateSlug() {
            let str = this.ProductName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const replacements = {
                "đ": "d",
                "Đ": "D"
            };

            str = str
                .replace(/đ/g, 'd')
                .replace(/Đ/g, 'D')
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '');
            this.Slug = str;
            this.Slug = this.Slug.replace(/^\-+|\-+$/g, '');



        },

        previewFiles(event) {
            const newFilesArray = Array.from(event.target.files);
            this.processedFiles = newFilesArray;
            for (let i = 0; i < newFilesArray.length; i++) {
                const imgSrc = URL.createObjectURL(newFilesArray[i]);
                this.imagesPreview.push(imgSrc);
            }
        },
        removeImage(index) {
            this.imagesPreview.splice(index, 1);
            this.processedFiles.splice(index, 1);
        },
        removeImageMain(index, data) {
            this.fullImg.splice(index, 1);
            if (data) {
                const formData = new FormData();
                formData.append('id', data.id);
                axios.post('/Products/Delete', formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
            }
        },


        onFileChange(event) {
            this.imageFile = event.target.files[0];
            this.previewImage = URL.createObjectURL(this.imageFile);
            this.uploadedImage = null;
        },
        onFileChange1(event) {
            this.imageFile1 = event.target.files[0];
            this.previewImage1 = URL.createObjectURL(this.imageFile1);
            this.uploadedImage1 = null;
        },
        formatDate(date) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return date.toLocaleDateString('vi-VN', options);
        },
        formatCurrency(amount) {
            const formatter = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            });

            return formatter.format(amount);
        },
        async addProducts() {
            try {
              
                const formData = new FormData();

                formData.append('Quantity', this.quantity);
                formData.append('ProductName', this.ProductName);
                formData.append('Description', this.ckName);
                formData.append('ShortDescription', this.ShortDescription);
                formData.append('Slug', this.Slug);
                formData.append('Price', this.Price);
                formData.append('PriceDiscount', this.PriceDiscount);
                formData.append('CategoryID', this.CategoryID);
                formData.append('PrPath', this.$refs.PrPath.files[0]);
                await axios.post('/Products/AddProduct', formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then((rs => {
                        if (rs.data.code == 400) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Lỗi',
                                text: `${rs.data.message}`,
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    return;
                                }
                            });
                        } else {
                            Swal.fire({
                                icon: 'success',
                                title: 'Thành công',
                                text: 'Đã lưu thành công',
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.reload();
                                }
                            });
                        }
                       
                    }))
               
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Đã có lỗi xảy ra',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            }
        },
        getItemsById(id) {
            axios.get(`/Products/getIdProducts?id=${id}`)
                .then((response) => {

                    this.id = response.data.id;
                    this.ProductName = response.data.productName;
                    this.ShortDescription = response.data.shortDescription;
                    this.SubCategoryID = response.data.courseID;
                    this.Slug = response.data.slug;
                    this.Price = response.data.price;
                    this.PriceDiscount = response.data.priceDiscount;
                    this.CategoryID = response.data.categoryID;
                    this.detailsCkName = response.data.description;
                    this.imageProducts = response.data.imageMain;

                    configureCKEditor('#editorMain', this, this.detailsCkName);


                    return Promise.resolve();
                });
        },
        resetData() {
            this.id = 0;
            this.ProductName = "";
            this.ShortDescription = "";
            this.SubCategoryID = "";
            this.Slug = "";
            this.ckName = "";
            this.Price = 0;
            this.PriceDiscount = 0;
            this.CategoryID = 0;
            this.detailsCkName = "";
            this.imageProducts = "";

            this.$refs.PrPath1.files[0] = null;
            this.$refs.PrPath.files[0] = null;
            this.previewImage = null;
            this.previewImage1 = null;
            this.imageFile1 = null;
            this.imageFile = null;
            if (this.editor) {
                this.editor.then(editor => {
                    editor.destroy().then(() => {
                        this.editor = null;
                        // Khởi tạo lại CKEditor sau khi hủy bỏ
                        configureCKEditor('#editorMain', this, this.detailsCkName);
                    });
                });
            }

        },
        async editProducts() {

            try {

                if (this.CategoryID === 0  || this.ProductName === "" ) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Vui lòng nhập đủ các trường',
                        confirmButtonText: 'OK'
                    })
                    return;
                }
                if (this.Slug === "") {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Vui lòng nhập slug',
                        confirmButtonText: 'OK'
                    })
                    return;
                }
              

                const formData = new FormData();
                formData.append('Quantity', this.quantity);
                formData.append('ID', this.id);
                formData.append('ProductName', this.ProductName);
                formData.append('Description', this.ckName);
                formData.append('ShortDescription', this.ShortDescription);
                formData.append('Slug', this.Slug);
                formData.append('Price', this.Price);
                formData.append('PriceDiscount', this.PriceDiscount);
                formData.append('CategoryID', this.CategoryID);
                if (this.$refs.PrPath1.files[0] != null) {
                    formData.append('PrPath', this.$refs.PrPath1.files[0]);

                }

                await axios.post('/Products/UpdateProduct', formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Đã lưu thành công',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.loadSubItems();
                    }
                });
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Đã có lỗi xảy ra',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();

                    }
                });
            }
        },
        getItemsByIdDelete(id) {
            axios.get(`/Products/getIdProducts?id=${id}`)
                .then((response) => {
                    this.id = response.data.id;

                    if (this.id != null) {
                        Swal.fire({
                            title: 'Xóa sản phẩm',
                            text: 'Bạn có chắc chắn muốn xóa',
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Đồng ý',
                            cancelButtonText: 'Không!!!'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                const formData = new FormData();
                                formData.append('ID', this.id);
                                axios.post('/Products/deleteProducts', formData, {
                                    headers: {
                                        'Content-Type': 'application/x-www-form-urlencoded'
                                    }
                                }).then(response => {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Thành công',
                                        text: 'Đã thành công',
                                        confirmButtonText: 'OK',
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            this.loadSubItems();

                                        }
                                    });

                                }).catch(error => {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Lỗi',
                                        text: 'Đã có lỗi xảy ra vui lòng thử lại',
                                        confirmButtonText: 'OK'
                                    });
                                });
                            } else {
                                return;
                            }
                        });
                    }
                }).catch((error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Đã có lỗi xảy ra vui lòng thử lại',
                        confirmButtonText: 'OK'
                    });
                })
        },
    }
})