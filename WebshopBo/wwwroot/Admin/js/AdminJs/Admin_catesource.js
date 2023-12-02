var Admin_catesource = new Vue({
    el: "#Admin_catesource",
    data: {
        dataCm: [],
        dataCol: [],

        ColID: 0,
        nameCm: "",
        idCm: "",
        pickMain: 0,
        OrderNumber: 0,


        imageFile: null,
        previewImage: null,
        uploadedImage: null,

        imageFile1: null,
        previewImage1: null,
        uploadedImage1: null,
        imageProducts: "",
    },
    computed: {                     
    },
    watch: {                       
    },
    mounted() {
        this.loadCateItems();
        axios.get("/ConfigCol/GetAllChuDe")
            .then((response) => {
                this.dataCol = response.data;

                return Promise.resolve();
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
            if ($.fn.DataTable.isDataTable('#catesource_table')) {
                currentPage = $('#catesource_table').DataTable().page();
                $('#catesource_table').DataTable().destroy();
            }

            axios.get("/CategoryCourse/GetAllCategory")
                .then((response) => {
                    this.dataCm = response.data;
                    this.ColID = this.dataCm[0].colNumID;

                    $('#preloader').fadeOut();
                    return Promise.resolve();
                })
                .then(() => {
                    const table = $("#catesource_table").DataTable({
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


        UpdateHandel() {
            const formData = new FormData();

            formData.append('ColNumID', this.ColID);
            axios.post('/CategoryCourse/UpdateHandel', formData,
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
        },
        formatDate(date) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            return date.toLocaleDateString('vi-VN', options);
        },
        async addCategory() {
            try {
                if (this.nameCm === '') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Vui lòng nhập tên',
                        confirmButtonText: 'OK'
                    })
                    return;
                }
                const formData = new FormData();

                formData.append('Name', this.nameCm);
                formData.append('Pick', this.pickMain);
                formData.append('PrPath', this.$refs.PrPath.files[0]);
                formData.append('ColNumID', this.ColID);
                formData.append('OrderNumber', this.OrderNumber);


                await axios.post('/CategoryCourse/AddCategory', formData,
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
            axios.get(`/CategoryCourse/GetByIDCategory?id=${id}`)
                .then((response) => {
                    this.idCm = response.data.id;
                    this.nameCm = response.data.name;
                    this.pickMain = response.data.pickMain ? 1 : 0;
                    this.imageProducts = response.data.banner;
                    this.ColID = response.data.colNumID;
                    this.OrderNumber = response.data.orderNumber;
                    return Promise.resolve();
                });
        },
        resetDataCategory() {
            this.idCm = "";
            this.nameCm = "";
            this.ColID = 0;
            this.pickMain = 0;
            this.OrderNumber = 0;
            this.imageProducts = "";
            this.$refs.PrPath1.files[0] = null;
            this.$refs.PrPath.files[0] = null;
            this.previewImage = null;
            this.previewImage1 = null;
            this.imageFile1 = null;
            this.imageFile = null;
        },
        async editCategory() {
            try {

                if (this.nameCm === '') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Vui lòng nhập tên',
                        confirmButtonText: 'OK'
                    })
                    return;
                }
                const formData = new FormData();
                formData.append('Name', this.nameCm);
                formData.append('ID', this.idCm);
                formData.append('Pick', this.pickMain);
                formData.append('ColNumID', this.ColID);
                formData.append('OrderNumber', this.OrderNumber);


                if (this.$refs.PrPath1.files[0] != null) {

                    formData.append('PrPath', this.$refs.PrPath1.files[0]);
                }
                await axios.post('/CategoryCourse/UpdateCategory', formData,
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
            axios.get(`/CategoryCourse/GetByIDCategory?id=${id}`)

                .then((response) => {
                    this.idCm = response.data.id;
                    if (this.idCm != null) {
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
                                formData.append('ID', this.idCm);
                                axios.post('/CategoryCourse/DeleteCategory', formData, {
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