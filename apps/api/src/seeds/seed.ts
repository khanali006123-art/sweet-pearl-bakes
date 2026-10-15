import { localStore } from '../config/store';

console.log('Seeding Sweet Pearl Bakes initial data...');
const store = localStore.getData();
console.log(`✅ Loaded ${store.products.length} products`);
console.log(`✅ Loaded admin credentials: admin@sweetpearlbakes.com / sweetpearl123`);
console.log(`✅ Initial order counter: ${store.orderCounter}`);
console.log('Seeding completed successfully!');
