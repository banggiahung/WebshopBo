var Admin_sub = new Vue({
    el: "#Admin_sub",
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
        ckName: "",

       

    },
    computed: {
       
        computedSlugSub() {
            return this.generateSlug(this.NameSub);
        } ,
       

    },
    watch: {
      
        computedSlugSub(newVal) {
            this.SlugSub = newVal;
        },
       
       
    },
    mounted() {
        this.loadCateItems();
        axios.get("/Categories/GetAllCategory")
            .then((response) => {
                this.dataCategory = response.data;
            });
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
            if ($.fn.DataTable.isDataTable('#subcategory_table')) {
                currentPage = $('#subcategory_table').DataTable().page();
                $('#subcategory_table').DataTable().destroy();
            }

            axios.get("/SubCategory/GetAllSubCategory")
                .then((response) => {
                    this.dataSubItems = response.data;
                    $('#preloader').fadeOut();

                    return Promise.resolve();
                })
                .then(() => {
                    const table = $("#subcategory_table").DataTable({
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
                if (this.NameSub === '') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Vui lòng nhập chọn danh mục',
                        confirmButtonText: 'OK'
                    })
                    return;
                }
                const formData = new FormData();

                formData.append('Name', this.NameSub);
                formData.append('Slug', this.SlugSub);
                formData.append('CategoryID', this.CateId);
                formData.append('url', `/hoc-tap/${this.SlugSub}`);

                await axios.post('/SubCategory/AddSub', formData,
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
            axios.get(`/SubCategory/GetByIDSub?id=${id}`)
                .then((response) => {
                    this.idSubCate = response.data.id;
                    this.NameSub = response.data.name;
                    this.CateId = response.data.categoryID;
                    return Promise.resolve();
                });
        },
        resetDataCategory() {
            this.idSubCate = "";
            this.NameSub = "";
            this.SlugSub = "";
            this.CateId = "";
           
          
        },
        async editCategory() {
            try {

                if (this.NameSub === '') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Vui lòng nhập chọn danh mục',
                        confirmButtonText: 'OK'
                    })
                    return;
                }
                const formData = new FormData();
                formData.append('Name', this.NameSub);
                formData.append('ID', this.idSubCate);
                formData.append('Slug', this.SlugSub);
                formData.append('CategoryID', this.CateId);
               


                await axios.post('/SubCategory/UpdateSub', formData,
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
            axios.get(`/SubCategory/GetByIDSub/${id}`)
                .then((response) => {
                    this.idSubCate = response.data.id;
                    this.SlugSub = response.data.slug;
                    if (this.idSubCate != null) {
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
                                formData.append('ID', this.idSubCate);
                                formData.append('url', `/hoc-tap/${this.SlugSub}`);

                                axios.post('/SubCategory/DeleteSub', formData, {
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