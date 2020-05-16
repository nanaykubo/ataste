$(document).ready(function(){
    refresh();

    setInterval(function(){
        refresh(); },
    10000);
});

function refresh(){
    getRemainingStocks();
    getTodayOrders();
    getTodaySales();
    getPendingPayment();
    getPendingDelivery();

    $("#myTable tbody tr").empty();
    $("#nav").remove();

    getTodayTrack();
}

function getRemainingStocks(){

    fetch('http://localhost:5000/getStock')
    .then(response => response.json())
    .then(function(data) {
        
        data.forEach(function(item){
            if(item.ItemCode == 'CGES'){
               document.getElementById('StocksSpicy').innerHTML = item.OrderQTY;
            }else if(item.ItemCode == 'CGR'){
                document.getElementById('StocksReg').innerHTML = item.OrderQTY;
            }

        });
    })


};

function getTodayOrders(){

    fetch('http://localhost:5000/getTodayOrders')
    .then(response => response.json())
    .then(function(data) {
        try{
            data.forEach(function(item){
            document.getElementById('totalOrders').innerHTML = item.OrderQTY;
            });
        }catch{
            document.getElementById('totalOrders').innerHTML = '0';
        }
    })


};

function getTodayOrders(){

    fetch('http://localhost:5000/getTodayOrders')
    .then(response => response.json())
    .then(function(data) {
        try{
        data.forEach(function(item){
            document.getElementById('totalOrders').innerHTML = item.OrderQTY;
        });
        }catch{
            document.getElementById('totalOrders').innerHTML = '0';
        }
    })
};

function getTodaySales(){

    fetch('http://localhost:5000/getTodaySales')
    .then(response => response.json())
    .then(function(data) {
        if(data[0].Price != null){
            console.log('test')
            data.forEach(function(item){
                document.getElementById('totalSales').innerHTML = item.Price;
            });
        }else{
            document.getElementById('totalSales').innerHTML = '0';
        }
    })
};

function getPendingDelivery(){
     
    fetch('http://localhost:5000/getTodayPendingDelivery')
    .then(response => response.json())
    .then(function(data) {
        if(data[0].Price != null){
            data.forEach(function(item){
                document.getElementById('pendingDelivery').innerHTML = item.Price;
            });
        }else{
            document.getElementById('pendingDelivery').innerHTML = '0';
        }
    })
};

function getPendingPayment(){

    fetch('http://localhost:5000/getTodayPendingPayment')
    .then(response => response.json())
    .then(function(data) {
        if(data[0].Price != null){
            data.forEach(function(item){
                document.getElementById('pendingPayment').innerHTML = item.Price;
            });
        }else{
            document.getElementById('pendingPayment').innerHTML = '0';
        }
    })
};

function getTodayTrack(){
    fetch('http://localhost:5000/getTodayTrack')
    .then(response => response.json())
    .then(function(data) {

        data.forEach(function(item){
            
            if(item.DateReceived == null){
                badges +='<td><span class="badge badge-info" style="color:white">P. Delivery</span></td>';
            }else if(item.DatePaid ==null){
                badges ='<td><span class="badge badge-warning" style="color:white">P. Payment</span></td>';
            }else{
                badges ='<td><span class="badge badge-success">Paid</span></td>';
            }

            $('#myTable').append(
            '<tr>' +
            '<th scope="row"><img src="Assets/img/'+item.Picture+'" alt="Jorene" class="avatar"></th>' +
            '<td>'+item.ItemName+'</td>' +
            '<td>'+item.OrderQty+'</td>' +
            ''+badges+'' +
            '</tr>' 
            );
        });

        $('#myTable').after('<div class="col-sm-12 col-md-5"></div><div class="col-sm-12 col-md-7" style="text-align:right;"> <div id="nav" class="pagination"></div></div>');
        var badges = '';
        var rowsShown = 5;
        var rowsTotal = $('#myTable tbody tr').length;
        var numPages = rowsTotal/rowsShown;
        for(i = 0;i < numPages;i++) {
        var pageNum = i + 1;
        $('#nav').append('<a href="#myTable" rel="'+i+'">'+pageNum+'</a> ');
        }
        $('#myTable tbody tr').hide();
        $('#myTable tbody tr').slice(0, rowsShown).show();
        $('#nav a:first').addClass('active');
        $('#nav a').bind('click', function(){

        $('#nav a').removeClass('active');
        $(this).addClass('active');
        var currPage = $(this).attr('rel');
        var startItem = currPage * rowsShown;
        var endItem = startItem + rowsShown;
        $('#myTable tbody tr').css('opacity','0.0').hide().slice(startItem, endItem).
        css('display','table-row').animate({opacity:1}, 300);
        });
            
    })

    


};