import Image from 'next/image';

const MenuItem = ({ props }: any) => {
  return (
    <>
      <div className={`flex items-center gap-3`}>
        <Image
          className="block"
          src={props?.iconPath}
          alt={props?.label}
          width={24}
          height={24}
        />
        <span className="text-base font-medium mr-auto">{props?.label}</span>
        {props?.numberList && (
          <span className="badge-danger">
            <span className="text-xs font-medium font-poppins">
              {props?.numberList}
            </span>
          </span>
        )}
      </div>
    </>
  );
};

export default MenuItem;
