import { useContract } from "./useContract";
import MypubgAbi from "../contracts/Mypubg.json";
import MypubgContractAddress from "../contracts/Mypubg-address.json";

export const useMinterContract = () =>
  useContract(MypubgAbi.abi, MypubgContractAddress.Mypubg);
