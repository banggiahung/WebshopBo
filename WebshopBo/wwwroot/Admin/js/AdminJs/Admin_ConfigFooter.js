var config_footer = new Vue({
    el: '#config_footer',
    data: {
        dataUser: [],
        dataFooter: [],
        nameCate: "",
        id: 0,
        dataPage: [],
        checkedItems: [],
        dataSup: [],
        checkSup: []
    },
    //computed: {
    //    getCheckedItems() {
    //        return this.checkedItems;
    //    }
    //},
    //watch: {
    //    getCheckedItems() {
    //        // Xử lý khi có sự thay đổi trong checkedItems
    //        this.dataFooter.forEach((footerItem) => {
    //            this.dataPage.forEach((pageItem) => {
    //                if (footerItem.cauHinhFooter1 === pageItem.id) {
    //                    // Kiểm tra nếu có trùng khớp, thêm ID vào checkedItems
    //                    if (!this.checkedItems.includes(pageItem.id)) {
    //                        this.checkedItems.push(pageItem.id);
    //                    }
    //                }
    //            });
    //        });
    //    }
    //},
    mounted() {
        $('#preloader').fadeIn();
        this.loadData();
      
    },
    methods: {
        loadData() {
            $('#preloader').fadeIn();
            // Tải dữ liệu từ hai endpoints khác nhau
            axios.get("/Page/GetAllPagePostTitle")
                .then((response) => {
                    this.dataPage = response.data;

                    this.checkFooterConfig();

                    return Promise.resolve();
                })
            axios.get("/Support/GetAllPagePostTitle")
                .then((response) => {
                    this.dataSup = response.data;
                    this.checkFooterSubConfig();
                    return Promise.resolve();

                });
            axios.get("/FooterConfig/GetAllFooter")
                .then((response) => {
                    this.dataFooter = response.data;
                    this.checkFooterConfig();
                    this.checkFooterSubConfig();


                })
                .finally(() => {
                    $('#preloader').fadeOut();
                });


        },
        checkFooterConfig() {
            if (this.dataPage.length === 0 ) {
                return;
            }

            this.dataPage.forEach(page => {
                const correspondingFooter = this.dataFooter.find(footer => footer.cauHinhFooter1 === page.id);
                if (correspondingFooter) {
                    page.checked = true; 
                }
            });
            this.$forceUpdate();
        },
        checkFooterSubConfig() {
            if (this.dataSup.length === 0 ) {
                return;
            }

            this.dataSup.forEach(page => {
                const correspondingFooter = this.dataFooter.find(footer => footer.cauHinhHoTro === page.id);
                if (correspondingFooter) {
                    page.checked = true; 
                }
            });
            this.$forceUpdate();
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
        handleCheckboxChange(item) {
            Swal.fire({
                title: 'Đang xử lý...',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading();
                },
                showConfirmButton: false
            });
            const formData = new FormData();
            if (item.checked) {
                try {
                    formData.append('CauHinhFooter1', item.id);

                    axios.post('/FooterConfig/AddFooter', formData, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(res => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Thành công',
                            text: 'Đã thành công',
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload();
                            }
                        });
                    })
                } catch (error) {
                    console.error('Lỗi:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Lỗi trong quá trình cập nhật',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                }

            } else {
                try {
                    formData.append('CauHinhFooter1', item.id);
                    axios.post('/FooterConfig/DeleteFooter', formData, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(res => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Thành công',
                            text: 'Đã thành công',
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload();
                            }
                        });
                    })
                } catch (error) {
                    console.error('Lỗi:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Lỗi trong quá trình cập nhật',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                }
            }
            console.log(`Checkbox ${item.id} checked: ${typeof item.checked}`);
        },
        handleCheckboxChangeSup(item) {
            Swal.fire({
                title: 'Đang xử lý...',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading();
                },
                showConfirmButton: false
            });
            const formData = new FormData();
            if (item.checked) {
                try {
                    formData.append('CauHinhHoTro', item.id);

                    axios.post('/FooterConfig/AddFooterSup', formData, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(res => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Thành công',
                            text: 'Đã thành công',
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload();
                            }
                        });
                    })
                } catch (error) {
                    console.error('Lỗi:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Lỗi trong quá trình cập nhật',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                }

            }
            else {
                try {
                    formData.append('CauHinhHoTro', item.id);
                    axios.post('/FooterConfig/DeleteFooterSup', formData, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }).then(res => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Thành công',
                            text: 'Đã thành công',
                            confirmButtonText: 'OK'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload();
                            }
                        });
                    })
                } catch (error) {
                    console.error('Lỗi:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: 'Lỗi trong quá trình cập nhật',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.reload();
                        }
                    });
                }
            }
            console.log(`Checkbox ${item.id} checked: ${typeof item.checked}`);
        },
        async handleTransaction(userNap) {
            Swal.fire({
                title: 'Đang xử lý...',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading();
                },
                showConfirmButton: false
            });
            const formData = new FormData();
            try {
                if (!userNap.status) {

                    userNap.status = true;
                    formData.append('id', userNap.id);

                    axios.post('/Config/UpdateRecharage', formData, {
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }

                    }).then(res => {
                        if (res.data) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Thành công',
                                text: 'Đã thành công',
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.reload();
                                }
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Lỗi',
                                text: 'Lỗi trong quá trình gửi mail',
                                confirmButtonText: 'OK'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.reload();
                                }
                            });
                        }
                    })

                }
            } catch {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Lỗi trong quá trình gửi mail',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            }
            


        },

    }
});