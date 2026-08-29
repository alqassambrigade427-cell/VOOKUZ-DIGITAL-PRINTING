
function toggleMenu(){document.querySelector('.navlinks').classList.toggle('show')}

function rupiah(n){return 'Rp ' + Number(n||0).toLocaleString('id-ID')}
function getOrders(){return JSON.parse(localStorage.getItem('vookuzOrders')||'[]')}
function saveOrders(data){localStorage.setItem('vookuzOrders',JSON.stringify(data))}

function submitOrder(e){
 e.preventDefault();
 const f=e.target;
 const orders=getOrders();
 const order={
   id:'VKZ-'+Date.now().toString().slice(-7),
   customer:f.nama.value,
   whatsapp:f.whatsapp.value,
   product:f.produk.value,
   qty:f.jumlah.value,
   total:Number(f.total.value||0),
   payment:f.pembayaran.value,
   status:'Menunggu Proses',
   date:new Date().toLocaleString('id-ID')
 };
 orders.unshift(order);saveOrders(orders);
 document.getElementById('orderResult').style.display='block';
 document.getElementById('orderResult').innerHTML='Pesanan berhasil dibuat! Nomor pesanan: <b>'+order.id+'</b>. Simpan nomor ini untuk cek pesanan.';
 f.reset();
}

function checkOrder(e){
 e.preventDefault();
 const q=document.getElementById('trackingId').value.trim().toLowerCase();
 const o=getOrders().find(x=>x.id.toLowerCase()===q);
 const out=document.getElementById('trackingResult');out.style.display='block';
 if(!o){out.innerHTML='❌ Pesanan tidak ditemukan. Pastikan nomor pesanan benar.';out.style.background='#fee2e2';out.style.color='#991b1b';return}
 out.style.background='#e0f2fe';out.style.color='#075985';
 out.innerHTML='<b>'+o.id+'</b><br>Customer: '+o.customer+'<br>Produk: '+o.product+'<br>Status: <b>'+o.status+'</b><br>Pembayaran: <b>'+o.payment+'</b><br>Total: '+rupiah(o.total);
}

function renderDashboard(){
 const orders=getOrders();
 const paid=orders.filter(o=>o.payment==='Sudah Dibayar');
 const unpaid=orders.filter(o=>o.payment!=='Sudah Dibayar');
 const revenue=paid.reduce((a,b)=>a+Number(b.total||0),0);
 const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v}
 set('totalOrder',orders.length);set('paidOrder',paid.length);set('unpaidOrder',unpaid.length);set('revenue',rupiah(revenue));
 const tbody=document.getElementById('orderRows');if(!tbody)return;
 tbody.innerHTML=orders.map(o=>`<tr><td>${o.id}</td><td>${o.customer}</td><td>${o.product}</td><td>${rupiah(o.total)}</td><td><button class="badge ${o.payment==='Sudah Dibayar'?'paid':'unpaid'}" onclick="togglePayment('${o.id}')">${o.payment}</button></td><td><button class="btn dark" style="padding:7px 10px" onclick="deleteOrder('${o.id}')">Hapus</button></td></tr>`).join('')||'<tr><td colspan="6">Belum ada pesanan.</td></tr>';
}
function togglePayment(id){const x=getOrders().map(o=>o.id===id?{...o,payment:o.payment==='Sudah Dibayar'?'Belum Dibayar':'Sudah Dibayar'}:o);saveOrders(x);renderDashboard()}
function deleteOrder(id){if(confirm('Hapus pesanan ini?')){saveOrders(getOrders().filter(o=>o.id!==id));renderDashboard()}}
document.addEventListener('DOMContentLoaded',renderDashboard);
