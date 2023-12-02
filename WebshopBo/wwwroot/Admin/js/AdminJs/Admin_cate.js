var Admin_category = new Vue({
    el: "#Admin_category",
    data: {
        currentTab: localStorage.getItem('activeTab') || 'pills-home',
        //DỮ liệu category
        dataCategory: [],
        SlugCategory: "",
        NameCategory: "",
        idCategory: "",
        imgCategory: "",
       pickColor: "",
        pickColor2: "",

        dataSubItems: [],
        idSubCate: "",
        NameSub: "",
        SlugSub: "",
        CateId: "",

        dataTool: [],
        idTool: "",
        NameTool: "",
        SlugTool: "",

        imageFile: null,
        previewImage: null,
        uploadedImage: null,
        
        imageFile1: null,
        previewImage1: null,
        uploadedImage1: null,

        SlugEdit: "",

        dataItems: [],
        ProductName: "",
        CategoryName: "",
        Description: "",
        Slug: "",
        Price: 0,
        CategoryID: 0,
        PrPath: null,
        imageFile: null,
        previewImage: null,
        uploadedImage: null,
        productID: 0,
        product_ImagePath: "",
        id: "",
        categoryID: 0,
        categoryName: "",
        imageCategory: "",
        createdDate: "",
        modifiedDate: "",



    },
    computed: {
        

    },
    watch: {
       
       
    },
    mounted() {
        this.loadCateItems();
       
    },
    methods: {
       
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
        loadCateItems() {

            $('#preloader').fadeIn();
            let currentPage = 0;
            if ($.fn.DataTable.isDataTable('#category_table')) {
                currentPage = $('#category_table').DataTable().page();
                $('#category_table').DataTable().destroy();
            }

            axios.get("/Categories/GetAllCategories")
                .then((response) => {
                    this.dataCategory = response.data;
                    $('#preloader').fadeOut();

                    return Promise.resolve();
                })
                .then(() => {
                    const table = $("#category_table").DataTable({
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
            let str = this.CategoryName.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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
        formatDate(date) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return date.toLocaleDateString('vi-VN', options);
        },
        async addCategory() {
            try {
                const formData = new FormData();
                formData.append('CategoryName', this.CategoryName);
                formData.append('Slug', this.Slug);
                formData.append('PrPath', this.$refs.PrPath.files[0]);

                await axios.post('/Categories/AddCategory', formData,
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
            axios.get(`/Categories/getIdCategory?id=${id}`)
                .then((response) => {

                    this.categoryID = response.data.categoryID;
                    this.CategoryName = response.data.categoryName;
                    this.imageCategory = response.data.imageCategory;
                    this.createdDate = response.data.createdDate;
                    this.Slug = response.data.slug;
                    this.modifiedDate = response.data.modifiedDate;

                    return Promise.resolve();
                });
            this.resetDataImg();
        },
        resetData() {
            this.categoryID = 0;
            this.CategoryName = "";
            this.imageCategory = "";
            this.Slug = "";
            this.createdDate = "";
            this.modifiedDate = "";

        },
        async editCategory() {
            try {
                if (this.Slug == " ") {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'vui lòng nhập slug',
                        confirmButtonText: 'OK'
                    });
                    return;
                }
                const formData = new FormData();
                formData.append('CategoryName', this.CategoryName);
                formData.append('CategoryID', this.categoryID);
                formData.append('Slug', this.Slug);
                if (this.$refs.PrPath1.files[0] != null) {
                    formData.append('PrPath', this.$refs.PrPath1.files[0]);
                }
                await axios.post('/Categories/UpdateCategory', formData,
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
            axios.get(`/Categories/GetByIDCategory/${id}`)
                .then((response) => {
                    this.idCategory = response.data.categoryID;
                    if (this.idCategory != null) {
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
                                formData.append('CategoryID', this.idCategory);
                                axios.post('/Categories/DeleteCategory', formData, {
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
                                            window.location.reload();


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

});