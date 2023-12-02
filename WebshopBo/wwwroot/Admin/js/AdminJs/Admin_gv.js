var Admin_giaovien = new Vue({
    el: "#Admin_giaovien",
    data: {
        currentTab: localStorage.getItem('activeTab') || 'pills-home',
        //DỮ liệu category
        dataGiaoVien: [],
        SlugGiaoVien: "",
        NameGiaoVien: "",
        idGv: "",
        imgGiaoVien: "",
        congViec: "",
        noiLamViec: "",
        detailsGiaoVien:"",        

        imageFile: null,
        previewImage: null,
        uploadedImage: null,

        ckName: "",
        editor: "",
        Details: "",

        nameCall: ['Cô', 'Thầy'],
        valCall: "",


    },
    computed: {
        computedSlug() {
            return this.generateSlug(this.NameGiaoVien);
        },
       

    },
    watch: {
        computedSlug(newVal) {
            this.SlugGiaoVien = newVal;
        },
    },
    beforeDestroy() {
        if (this.ckName) {
            this.ckName.destroy();
        }
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
       
        loadCateItems() {
            if (this.ckName) {
                this.ckName.destroy(); 
            }
            configureCKEditor('#editor', this, this.detailsGiaoVien || {});

            $('#preloader').fadeIn();
            let currentPage = 0;
            if ($.fn.DataTable.isDataTable('#giaovien_table')) {
                currentPage = $('#giaovien_table').DataTable().page();
                $('#giaovien_table').DataTable().destroy();
            }

            axios.get("/GiaoVien/GetAllGiaoVien")
                .then((response) => {
                    this.dataGiaoVien = response.data;
                    $('#preloader').fadeOut();

                    return Promise.resolve();
                })
                .then(() => {
                    const table = $("#giaovien_table").DataTable({
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
                if (this.NameGiaoVien === '') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Vui lòng nhập chọn danh mục',
                        confirmButtonText: 'OK'
                    })
                    return;
                }
                const formData = new FormData();

                formData.append('TenGiaoVien', this.NameGiaoVien);
                formData.append('Slug', this.SlugGiaoVien);
                formData.append('CongViec', this.congViec);
                formData.append('NoiLamViec', this.noiLamViec);
                formData.append('DetailsGiaoVien', this.ckName);
                formData.append('PrPath', this.$refs.PrPath.files[0]);
                formData.append('CallName', this.valCall);

                await axios.post('/GiaoVien/AddGiaoVien', formData,
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
            axios.get(`/GiaoVien/GetByIDGiaoVien?id=${id}`)
                .then((response) => {
                    this.idGv = response.data.id;
                    this.NameGiaoVien = response.data.tenGiaoVien;
                    this.congViec = response.data.congViec;
                    this.noiLamViec = response.data.noiLamViec;
                    this.detailsGiaoVien = response.data.detailsGiaoVien;
                    this.imgGiaoVien = response.data.imgGiaoVien;
                    this.valCall = response.data.callName;

                    configureCKEditor('#editorMain', this, this.detailsGiaoVien);

                    return Promise.resolve();
                });
        },
        resetDataCategory() {
            this.idGv = "";
            this.NameGiaoVien = "";
            this.congViec = "";
            this.noiLamViec = "";
            this.detailsGiaoVien = "";
            this.imgGiaoVien = "";
            this.valCall = "";
            this.$refs.PrPath1.files[0] = null;
            this.$refs.PrPath.files[0] = null;
            this.imagesPreview = [];
            this.previewImage = null;

        },
        async editCategory() {
            try {

                if (this.NameGiaoVien === '') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Vui lòng nhập chọn danh mục',
                        confirmButtonText: 'OK'
                    })
                    return;
                }
                const formData = new FormData();
                formData.append('TenGiaoVien', this.NameGiaoVien);
                formData.append('Slug', this.SlugGiaoVien);
                formData.append('CongViec', this.congViec);
                formData.append('NoiLamViec', this.noiLamViec);
                formData.append('DetailsGiaoVien', this.ckName);
                if (this.$refs.PrPath1.files[0] != null) {

                    formData.append('PrPath', this.$refs.PrPath1.files[0]);
                }
                formData.append('CallName', this.valCall);
                formData.append('ID', this.idGv);
                if (this.pickColor2 != "") {

                    formData.append('PickColor', this.pickColor2);
                } else {
                    formData.append('PickColor', this.pickColor);

                }



                await axios.post('/GiaoVien/UpdateGiaoVien', formData,
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
            axios.get(`/GiaoVien/GetByIDGiaoVien/${id}`)
                .then((response) => {
                    this.idGv = response.data.id;
                    if (this.idGv != null) {
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
                                formData.append('ID', this.idGv);
                                axios.post('/GiaoVien/DeleteGiaoVien', formData, {
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