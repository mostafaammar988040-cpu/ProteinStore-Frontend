import "./ProductModal.css";

function ProductModal({ product, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {/* CLOSE */}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        {/* IMAGE */}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="modal-image"
        />

        {/* TITLE */}
        <h2 className="modal-title">{product.name}</h2>

        {/* WEIGHT */}
        <p className="modal-weight">{product.weight}</p>

        {/* PRICE (INFO ONLY) */}
        <div className="modal-price">${product.price}</div>

        {/* LONG DESCRIPTION */}
        <div className="modal-description">
          <p>
            {product.description ||
              `This premium whey protein supplement is designed for athletes
              and fitness enthusiasts who demand fast absorption, high purity,
              and reliable performance. Each serving delivers high-quality
              protein to support muscle recovery, strength development, and
              lean muscle growth.`}
          </p>

          <p>
            Manufactured using advanced filtration techniques, this product
            helps minimize fats and carbohydrates while preserving essential
            amino acids. Ideal for post-workout recovery or daily protein
            intake.
          </p>

          <p>
            Whether your goal is muscle building, recovery, or maintaining
            a high-protein diet, this formulation provides a clean and
            effective solution trusted by athletes worldwide.
          </p>
        </div>

        {/* OPTIONAL DETAILS */}
        <div className="modal-details">
          <div>
            <strong>✔ Protein Type:</strong> Whey Protein
          </div>
          <div>
            <strong>✔ Usage:</strong> Post-workout or anytime
          </div>
          <div>
            <strong>✔ Quality:</strong> Lab-tested & trusted brand
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
