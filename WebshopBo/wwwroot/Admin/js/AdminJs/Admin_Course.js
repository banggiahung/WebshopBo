Admin_Course = new Vue({
    el: '#Admin_Course',
    data: {
        dataItems: [],
        dataProductsItems: [],
        dataSubItems: [],
        filteredSubCategories: [],
        dataCate: [],
        dataCm: [],

        id: "",
        CategoryID: 0,
        SubCategoryID: 0,
        ToolId: 0,
        RimID: 0,
        brandsID: 0,
        clbID: 0,
        sizeID: 0,
        CateId: 0,
        CategoryID: 0,
        MainID: 0,
        SizeArray: [],

        CodeProduct: "",
        Titile: "",
        PriceMain: 0,
        DisPrice: 0,
        OrderNumber: 0,
        ImageMain: "",
        ShortDes: "",
        Details: "",
        LinkDownload: "",

        imageFile: null,
        previewImage: null,
        uploadedImage: null,

        imageFile1: null,
        previewImage1: null,
        uploadedImage1: null,
        imageProducts: "",

        BannerPage: "",
        SubCategoryName: "",
        Slug: "",

        selectedFiles: null,
        imagesPreview: [],
        fullImg: [],
        processedFiles: [],
        listNumber: [],
        suggestions: [],
        originalDataColor: [],
        DataSubCateMain: [],

        ckName: "",
        editor: "",


        showTable1: true,
        shouldGenerateSlug: true,
        readonlySlug: true
    },
    computed: {
        //computedSlug() {
        //    if (this.shouldGenerateSlug) {
        //        return this.generateSlug(this.Titile);
        //    }
        //    return this.Slug;
        //}

    },
    watch: {
        //computedSlug(newVal) {
        //    this.Slug = newVal;
        //},


    },
    beforeDestroy() {
        if (this.editor) {
            this.editor.destroy();
        }
    },
    mounted() {

        $('#preloader').fadeIn();
        this.loadSubItems();
        axios.get("/CategoryCourse/GetAllCategory")
            .then((response) => {
                this.dataCm = response.data;

                return Promise.resolve();
            });
        axios.get("/SubCategory/GetAllSubCategory")
            .then((response) => {
                this.dataCate = response.data;

                return Promise.resolve();
            })

    },
    methods: {
        loadCate(idSub) {
            if (!idSub) {
                this.DataSubCateMain = [];
                return;
            }
            $('#preloader').fadeIn();

            axios.get(`/Course/GetSub?id=${idSub}`)
                .then((response) => {
                    this.DataSubCateMain = response.data;
                    $('#preloader').fadeOut();

                    return Promise.resolve();
                });
        },
        stopSlugGeneration() {
            this.shouldGenerateSlug = false;
        },
        toggleTables() {
            this.showTable1 = !this.showTable1;
            if (!this.showTable1) {

                $('#product_table').DataTable().destroy();

            } else {
                this.loadSubItems();

            }
        },

        loadSubItems() {
            let currentPage = 0;
            if ($.fn.DataTable.isDataTable('#product_table')) {
                currentPage = $('#product_table').DataTable().page();
                $('#product_table').DataTable().destroy();
            }

            axios.get("/Course/GetAllCourse")
                .then((response) => {
                    this.dataProductsItems = response.data;
                    $('#preloader').fadeOut();

                    return Promise.resolve();
                })
                .then(() => {
                    const table = $("#product_table").DataTable({
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

            console.log("Final slug:", str);

            return str;
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
                if (this.DisPrice > this.BeforePrice) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Giá giảm phải nhỏ hơn giá chính',
                        confirmButtonText: 'OK'
                    })
                    return;
                }
                if (this.MainSubID == 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Chưa có thuộc danh mục con',
                        confirmButtonText: 'OK'
                    })
                    return;
                }
                const foundItem = this.DataSubCateMain.find(item => item.id === this.MainID);
                const slugCate = foundItem.slug;
                const formData = new FormData();

                formData.append('Title', this.Titile);
                formData.append('Slug', this.Slug);
                formData.append('Price', this.PriceMain);
                formData.append('DisPrice', this.DisPrice);
                formData.append('Description', this.ckName);
                formData.append('PrPath', this.$refs.PrPath.files[0]);
                formData.append('PrPath1', this.$refs.PrPath1.files[0]);
                formData.append('CateCourse', this.CateId);
                formData.append('CategoryID', this.CategoryID);
                formData.append('MainSubID', this.MainID);
                formData.append('OrderNumber', this.OrderNumber);
                formData.append('url', `/danh-muc/${slugCate}/${this.Slug}`);


                await axios.post('/Course/AddCourse', formData,
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
            axios.get(`/Course/GetByIDCourse?id=${id}`)
                .then((response) => {
                    this.id = response.data.courseID;
                    this.Titile = response.data.title;
                    this.PriceMain = response.data.price;
                    this.DisPrice = response.data.disPrice;
                    this.ImageMain = response.data.banner;
                    this.BannerPage = response.data.bannerPage;
                    this.Details = response.data.description;
                    this.MainID = response.data.mainSubID;
                    configureCKEditor('#editor', this, this.Details);


                    return Promise.resolve();
                });
        },
        resetData() {
            this.id = "";
            this.Titile = "";
            this.PriceMain = 0;
            this.DisPrice = 0;
            this.MainID = 0;
            this.ImageMain = "";
            this.BannerPage = "";
            this.Details = "";
            this.DataSubCateMain = [];
            this.$refs.PrPath1.files[0] = null;
            this.$refs.PrPath.files[0] = null;
            this.imagesPreview = [];
            this.previewImage = null;
            this.previewImage1 = null;

            if (this.editor) {
                this.editor.setData('');
            } else {
                // Nếu chưa có trình soạn thảo, bạn có thể tạo một CKEditor mới
                configureCKEditor('#editorMain', this, {});
            }


        },
        async editProducts() {
            try {
                if (this.BeforePrice < this.DisPrice) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Giá giảm phải nhỏ hơn giá chính',
                        confirmButtonText: 'OK'
                    })
                    return;
                }


                if (this.SubCategoryID === 0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Vui lòng nhập chọn danh mục',
                        confirmButtonText: 'OK'
                    })
                    return;
                }
                const formData = new FormData();
                formData.append('CodeProduct', this.CodeProduct);
                formData.append('ID', this.id);
                formData.append('Titile', this.Titile);
                formData.append('Slug', this.Slug);
                formData.append('PriceMain', this.PriceMain);
                formData.append('DisPrice', this.DisPrice);
                formData.append('ShortDes', this.ShortDes);
                formData.append('CategoryId', this.CategoryID);
                formData.append('SubCategory', this.SubCategoryID);
                formData.append('ToolId', this.ToolId);
                formData.append('LinkDownload', this.LinkDownload);


                for (let i = 0; i < this.processedFiles.length; i++) {
                    formData.append('images', this.processedFiles[i]);
                }
                if (this.$refs.PrPath1.files[0] != null) {

                    formData.append('PrPath', this.$refs.PrPath1.files[0]);
                }


                await axios.post('/Products/UpdateProducts', formData,
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
        async getItemsByIdDelete(id) {

            try {
                const response = await axios.get(`/Course/GetByIDCourse/${id}`);
                this.id = response.data.courseID;
                this.MainID = response.data.mainSubID;
                this.Slug = response.data.slug;
                await axios.get(`/Course/GetSubMain?id=${this.MainID}`)
                    .then((response) => {
                        this.DataSubCateMain = response.data;

                    }).then(() => {
                        console.log(this.DataSubCateMain);
                        const foundItem = this.DataSubCateMain.find(item => item.id === this.MainID);
                        const slugCate = foundItem.slug;
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
                                    formData.append('CourseID', this.id);
                                    formData.append('url', `/danh-muc/${slugCate}/${this.Slug}`);

                                    axios.post('/Course/DeleteCourse', formData, {
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
                    })
               
                
            }
            catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Đã có lỗi xảy ra vui lòng thử lại',
                    confirmButtonText: 'OK'
                });
            }
        },
    }
})