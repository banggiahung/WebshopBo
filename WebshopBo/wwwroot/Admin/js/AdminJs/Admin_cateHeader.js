var header_vue = new Vue({
    el: "#header_vue",
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
        LinkURL: ""


    },
    computed: {
        computedSlug() {
            return this.generateSlug(this.NameCategory);
        },
        computedSlugSub() {
            return this.generateSlug(this.NameSub);
        } ,
        computedSlugTool() {
            return this.generateSlug(this.NameTool);
        }

    },
    watch: {
        computedSlug(newVal) {
            this.SlugCategory = newVal;
        },
        computedSlugSub(newVal) {
            this.SlugSub = newVal;
        },
        computedSlugTool(newVal) {
            this.SlugTool = newVal;
        },
       
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

            axios.get("/MainHeader/GetAllCategory")
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

        generateSlug(text) {
            if (text != null) {
                let str = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

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


                return str;
            }

        },
        formatDate(date) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return date.toLocaleDateString('vi-VN', options);
        },
        async addCategory() {
            try {
                if (this.NameCategory === '') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Vui lòng nhập chọn danh mục',
                        confirmButtonText: 'OK'
                    })
                    return;
                }
                const formData = new FormData();

                formData.append('Name', this.NameCategory);
                formData.append('Slug', this.SlugCategory);
                formData.append('LinkURL', this.LinkURL);

                await axios.post('/MainHeader/AddCategory', formData,
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
                        this.loadCateItems();
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
            axios.get(`/MainHeader/GetByIDCategory?id=${id}`)
                .then((response) => {
                    this.idCategory = response.data.id;
                    this.NameCategory = response.data.name;
                    this.LinkURL = response.data.linkURL;
                    return Promise.resolve();
                });
        },
        resetDataCategory() {
            this.idCategory = "";
            this.SlugCategory = "";
            this.NameCategory = "";
            this.pickColor = "";
            this.pickColor2 = "";
            this.LinkURL = "";
          
        },
        async editCategory() {
            try {

                if (this.NameCategory === '') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Vui lòng nhập chọn danh mục',
                        confirmButtonText: 'OK'
                    })
                    return;
                }
                const formData = new FormData();
                formData.append('Name', this.NameCategory);
                formData.append('ID', this.idCategory);
                formData.append('Slug', this.SlugCategory);
                formData.append('LinkURL', this.LinkURL);
             

                await axios.post('/MainHeader/UpdateCategory', formData,
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
                        this.loadCateItems();


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
            axios.get(`/MainHeader/GetByIDCategory/${id}`)
                .then((response) => {
                    this.idCategory = response.data.id;
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
                                formData.append('ID', this.idCategory);
                                axios.post('/MainHeader/DeleteCategory', formData, {
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