var edit_items = new Vue({
    el: '#edit_items',
    data: {
        dataItems: [],
        dataProductsItems: [],
        dataSubItems: [],
        filteredSubCategories: [],
        dataBrands: [],
        dataAge: [],
        dataItemsRim: [],
        dataTool: [],
        dataSize: [],
        dataColor: [],
        dataCm: [],

        id: "",
        CategoryID: 0,
        SubCategoryID: 0,
        ToolId: 0,
        RimID: 0,
        ViewCount: 0,
        brandsID: 0,
        clbID: 0,
        sizeID: 0,
        CateId: 0,
        SizeArray: [],

        CodeProduct: "",
        Titile: "",
        PriceMain: 0,
        DisPrice: 0,
        OrderNumber: 0,
        ImageMain: "",
        BannerPage: "",
        ShortDes: "",
        Details: "",
        LinkDownload: "",

        imageFile: null,
        previewImage: null,
        uploadedImage: null,
        imageProducts: "",
        imageFile1: null,
        previewImage1: null,
        uploadedImage1: null,
        slugURL: null,
        SubCategoryName: "",
        Slug: "",

        selectedFiles: null,
        slugCateEdit: null,
        slugCateNew: null,
        imagesPreview: [],
        fullImg: [],
        processedFiles: [],
        listNumber: [],
        suggestions: [],
        originalDataColor: [],
        DataSubCateMain: [],

        ckName: "",
        editor: "",
        CategoryID: 0,
        idSub: 0,
        MainID: 0,
        dataCate: [],
        DataSub: [],
        DataSubNew: [],



    },
    computed: {
        //computedSlug() {
        //    return this.generateSlug(this.Titile);
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
        this.id = $("#idItems").val();
        this.idSub = $("#idItemsSub").val();
        this.MainID = $("#idMainSub").val();
        this.getItemsById(this.id)
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
        axios.get(`/Course/GetSub?id=${this.idSub}`)
            .then((response) => {
                this.DataSubCateMain = response.data;

                return Promise.resolve();
            });
        axios.get(`/Course/GetSubMain?id=${this.MainID}`)
            .then((response) => {
                this.DataSub = response.data;
                console.log(this.DataSub);
                const foundItem = this.DataSub.find(item => item.id === this.MainID);
                this.slugCateEdit = foundItem.slug;
            });
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
        
        getItemsById(id) {
            $('#preloader').fadeIn();

            axios.get(`/Course/GetByIDCourse?id=${id}`)

                .then((response) => {
                    $('#preloader').fadeOut();

                    this.id = response.data.courseID;
                    this.Titile = response.data.title;
                    this.PriceMain = response.data.price;
                    this.DisPrice = response.data.disPrice;
                    this.ImageMain = response.data.banner;
                    this.ckName = response.data.description;
                    this.BannerPage = response.data.bannerPage;
                    this.CateId = response.data.cateCourse;
                    this.ViewCount = response.data.viewCount;
                    this.CategoryID = response.data.categoryID;
                    this.Slug = response.data.slug;
                    this.slugURL = response.data.slug;
                    this.MainID = response.data.mainSubID;
                    this.OrderNumber = response.data.orderNumber;
                    configureCKEditor('#editor', this, this.ckName || {});



                    return Promise.resolve();
                });
        },
        resetData() {
            this.id = "";
            this.Titile = "";
            this.Slug = "";
            this.slugURL = null;
            this.slugCateEdit = null;
            this.slugCateNew = null;
            this.PriceMain = 0;
            this.OrderNumber = 0;
            this.DisPrice = 0;
            this.MainID = 0;
            this.ViewCount = 0;
            this.ImageMain = "";
            this.BannerPage = "";
            this.CategoryID = 0;
            this.DataSubCateMain = [];
            this.Details = "";
            this.$refs.PrPath1.files[0] = null;
            this.$refs.PrPath2.files[0] = null;
            this.imagesPreview = [];
            this.previewImage = null;


        },
        async editProducts() {
            await axios.get(`/Course/GetSubMain?id=${this.MainID}`)
                .then((response) => {
                    this.DataSubNew = response.data;
                    console.log(this.DataSubNew);
                    const foundItem = this.DataSubNew.find(item => item.id === this.MainID);
                    this.slugCateNew = foundItem.slug;
                }).then(() => {
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
                        if (this.MainSubID == 0) {
                            Swal.fire({
                                icon: 'error',
                                title: 'Lỗi',
                                text: 'Chưa có thuộc danh mục con',
                                confirmButtonText: 'OK'
                            })
                            return;
                        }

                        const formData = new FormData();
                        formData.append('CourseID', this.id);
                        formData.append('Title', this.Titile);
                        formData.append('Slug', this.Slug);
                        formData.append('Price', this.PriceMain);
                        formData.append('DisPrice', this.DisPrice);
                        formData.append('Description', this.ckName);
                        formData.append('CateCourse', this.CateId);
                        formData.append('CategoryID', this.CategoryID);
                        formData.append('ViewCount', this.ViewCount);
                        formData.append('MainSubID', this.MainID);
                        formData.append('OrderNumber', this.OrderNumber);
                        if (this.slugURL === this.slug) {
                            console.log("same")
                        } else {
                            formData.append('oldUrl', `/danh-muc/${this.slugCateEdit}/${this.slugURL}`);
                            formData.append('newUrl', `/danh-muc/${this.slugCateNew}/${this.Slug}`);
                        }
                        if (this.$refs.PrPath1.files[0] != null) {

                            formData.append('PrPath', this.$refs.PrPath1.files[0]);
                        }
                        if (this.$refs.PrPath2.files[0] != null) {

                            formData.append('PrPath1', this.$refs.PrPath2.files[0]);
                        }


                        axios.post('/Course/UpdateCourse', formData,
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
                })
            
        },
       
    }
})