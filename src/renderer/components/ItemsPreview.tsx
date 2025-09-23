import { Divider } from 'antd';
import './ItemsPreview.css';

const ItemsPreview = ({ items }: any) => {
  return (
    <>
      {items.length ? (
        <div className="preview-section">
          <h2 className="preview-title">Items Detail</h2>
          {items.map((el: any, index: any) => (
            <div key={index} className="item-row">
              <div className="item-col">
                <p className="item-label">Name:</p>
                <p className="item-value">{el.ItemName}</p>
              </div>
              <div className="item-col">
                <p className="item-label">Price:</p>
                <p className="item-value">{el.Price}</p>
              </div>
              <div className="item-col">
                <p className="item-label">Sale Tax:</p>
                <p className="item-value">{el.TaxCharged}</p>
              </div>
              <div className="item-col">
                <p className="item-label">HS Code:</p>
                <p className="item-value">{el.HSCode}</p>
              </div>
              <div className="item-col">
                <p className="item-label">Quantity:</p>
                <p className="item-value">{el.Quantity}</p>
              </div>
              <Divider />
            </div>
          ))}

          <div className="total-section">
            <span className="total-label">Total Price:</span>
            <span className="total-value">
              Rs.{' '}
              {items.reduce(
                (total: any, item: any) => total + (item.TotalAmount || 0),
                0,
              )}
            </span>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ItemsPreview;
