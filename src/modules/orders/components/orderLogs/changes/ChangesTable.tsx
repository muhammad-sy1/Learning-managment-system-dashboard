// ChangesTable.tsx
import { getFieldLabel, formatValue } from '../utils/changeLogsUtils';

const ChangesTable = ({ changes, log, t }: { changes: any; log?: any; t: any }) => {
  const excludedFields = ["product_image", "product_name", "size", "color", "old", "new"];
  
  const fields = Object.keys(changes).filter(key => 
    !excludedFields.includes(key) && 
    (log?.old?.[key] !== undefined || changes[key] !== undefined)
  );

  if (fields.length === 0) return null;

  return (
    <table className="w-full text-sm rtl:text-right ltr:text-left">
      <thead>
        <tr className="bg-gray-100 text-black ">
          <th className="p-2 font-medium">{t('field')}</th>
          <th className="p-2 font-medium">{t('oldValue')}</th>
          <th className="p-2 font-medium">{t('newValue')}</th>
        </tr>   
      </thead>
      <tbody>
        {fields.map((key) => (
          <tr key={key} className="border-b border-gray-200 last:border-b-0">
            <td className="p-2 font-medium">{getFieldLabel(key, t)}</td>
            <td className="p-2">{formatValue(log?.old?.[key])}</td>
            <td className="p-2">{formatValue(changes[key])}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ChangesTable;