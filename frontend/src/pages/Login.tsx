import { useForm } from "react-hook-form";
import { ILogin } from "../interfaces/users";
import toast from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook, FaGoogle } from 'react-icons/fa';

const Login = () => {
    const { register, handleSubmit, formState: {errors} } = useForm<ILogin>()
    const navigete = useNavigate();
    const onSubmit = async (data: ILogin) => {
        try {
           const res =  await axios.post(`http://localhost:3000/api/signin`, data);
           if(res) {
            localStorage.setItem("token", res.data.accessToken)
           }
            toast.success("Đăng nhập thành công")
            navigete("/");
        } catch (error: any) {
            toast.error(error.response.data)
        }
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-700">
        Đăng Nhập
      </h2>
      <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nhập email"
            {...register("email", {
              required: "Không được để trống",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Sai định dạng email",
              },
            })}
          />
          {errors?.email && (
            <span className="p-2 text-red-600">
              {errors?.email?.message}
            </span>
          )}
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600">
            Mật khẩu
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Nhập mật khẩu"
            {...register("password", {
              required: "Không để trống mật khẩu",
              minLength: {
                value: 6,
                message: "Cần tối thiểu 6 ký tự",
              },
            })}
          />
          {errors?.password && (
            <span className="p-2 text-red-600">
              {errors?.password?.message}
            </span>
          )}
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 mt-6 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Đăng Nhập
        </button>
      </form>
      <div className="flex items-center justify-center mt-4">
        <span className="w-full border-b border-gray-300"></span>
        <span className="px-4 text-gray-500">Hoặc</span>
        <span className="w-full border-b border-gray-300"></span>
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        <button className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
          <FaFacebook className="mr-2" />
          Facebook
        </button>
        <button className="flex items-center px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400">
          <FaGoogle className="mr-2" />
          Google
        </button>
      </div>
      <p className="mt-4 text-sm text-center text-gray-600">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="text-blue-500 hover:underline">
          Đăng ký
        </Link>
      </p>
    </div>
  </div>
  );
};

export default Login;
