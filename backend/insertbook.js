const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://sakshichavan005:dFdBufFYycsxfOWV@cluster0.t4cykaq.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  description: String,
  imageUrl: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isAvailable: { type: Boolean, default: true }
});

const Book = mongoose.model('Book', bookSchema);

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    const newBook = new Book({
      title: "The chemist",
      author: "Paulo Coelho",
      description: "A philosophical novel about destiny and self-discovery.",
      imageUrl: "https://example.com/alchemist.jpg",
      // owner: new mongoose.Types.ObjectId("your-valid-user-id"),
      isAvailable: true
    });

    const saved = await newBook.save();
    console.log('📘 Book inserted:', saved);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('❌ Error:', err);
  });
