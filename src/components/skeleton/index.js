import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const Loaderfunction = () => {
  return (
    <li className="li">
      <SkeletonTheme baseColor="white" highlightColor="black">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            marginBottom: "10px",
            marginTop: "10px",
            marginLeft: "10px",
          }}
        >
          <Skeleton circle={true} height={50} width={50} />
          <div>
            <p>
              <Skeleton count={2} width={120} />
            </p>
          </div>
        </div>
        <Skeleton width={1000} height={300} count={1} />
        <p>
          <Skeleton width={1000} height={10} count={3} />
        </p>
      </SkeletonTheme>
    </li>
  );
};

export default Loaderfunction;
